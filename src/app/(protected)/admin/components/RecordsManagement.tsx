"use client";

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { EnumMappings } from '@/app/lib/enumMappings';
import { useState } from 'react';
import { Score } from './Score';

const indoorClassifications = [
    'IA3', 'IA2', 'IA1', 'IB3', 'IB2', 'IB1', 'IMB', 'IGMB', 'UNCLASSIFIED'
];
const outdoorClassifications = [
    'A3', 'A2', 'A1', 'B3', 'B2', 'B1', 'MB', 'GMB', 'EMB', 'UNCLASSIFIED'
];


const HandicapInput = ({ scoreId, initialValue }: { scoreId: string, initialValue: number | '' }) => {
    const [handicap, setHandicap] = useState<number | ''>(initialValue);

    const handleBlur = async () => {
        if (handicap === initialValue) return; // no change

        try {
            const response = await fetch(`/api/scores/${scoreId}/handicap`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roundHandicap: handicap }),
            });

            if (!response.ok) {
                throw new Error('Failed to update handicap');
            }
        } catch (error) {
            setHandicap(initialValue);
            console.error(error);
        }
    };

    return (
        <input
            type="number"
            value={handicap}
            min="0" max="100" step="1"
            onChange={e => setHandicap(e.target.value === '' ? '' : Number(e.target.value))}
            onBlur={handleBlur}
            style={{ width: '100%', boxSizing: 'border-box' }}
        />
    );
};


const ClassificationSelect = ({ score }: { score: any }) => {
    const currentClassification = score.roundType === 'INDOOR'
        ? score.roundIndoorClassification
        : score.roundOutdoorClassification;

    const [selected, setSelected] = useState(currentClassification || '');
    const options = score.roundType === 'INDOOR' ? indoorClassifications : outdoorClassifications;

    const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newClassification = event.target.value;
        setSelected(newClassification);

        try {
            const response = await fetch(`/api/scores/${score.id}/classification`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roundType: score.roundType, roundClassification: newClassification }),
            });

            if (!response.ok) {
                throw new Error('Failed to update classification');
            }
        } catch (error) {
            setSelected(score.roundClassification);
            console.error(error);
        }
    };

    return (
        <select value={selected} onChange={handleChange} style={{ width: '100%', textAlign: 'center' }}>
            <option value="" disabled>-</option>
            {options.map(opt => (
                <option key={opt} value={opt}>
                    {EnumMappings[opt] || opt}
                </option>
            ))}
        </select>
    );
};


const ProcessButton = ({ score }: { score: any }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleProcess = async () => {
        setIsProcessing(true);

        try {
            const response = await fetch(`/api/scores/${score.id}/process`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ processedAt: new Date().toISOString() }),
            });

            if (!response.ok) {
                throw new Error('Failed to process score');
            }
        } catch (error) {
            console.error('Error processing score:', error);
        } finally {
            setIsProcessing(false);
            window.location.reload();
        }
    };

    return (
        <button
            onClick={handleProcess}
            disabled={isProcessing || !!score.processedAt}
            style={{
                width: '100%',
                padding: '4px 8px',
                backgroundColor: score.processedAt ? '#4caf50' : '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: score.processedAt ? 'default' : 'pointer',
                opacity: score.processedAt ? 0.7 : 1
            }}
        >
            {isProcessing ? 'Processing...' : (score.processedAt ? 'Processed' : 'Process')}
        </button>
    );
};


export default function RecordsManagement({ scores }: { scores: Score[] }) {
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 0.8, sortable: true },
        { field: 'bowstyle', headerName: 'Bowstyle', flex: 0.8, sortable: true },
        { field: 'ageCategory', headerName: 'Age Category', flex: 0.8, sortable: true },
        { field: 'sex', headerName: 'Sex', flex: 0.5, sortable: true },

        { field: 'dateShot', headerName: 'Date Shot', flex: 0.8, sortable: true },
        { field: 'roundName', headerName: 'Round Name', flex: 1, sortable: true },

        { field: 'score', headerName: 'Score', flex: 0.5, sortable: true },
        { field: 'xs', headerName: 'Xs + Tens', flex: 0.5, sortable: true },
        { field: 'tens', headerName: 'Tens', flex: 0.5, sortable: true },
        { field: 'nines', headerName: 'Nines', flex: 0.5, sortable: true },
        { field: 'hits', headerName: 'Hits', flex: 0.5, sortable: true },

        { field: 'competitionLevel', headerName: 'Competition Level', flex: 1, sortable: false },

        {
            field: 'roundClassification',
            headerName: 'Classification',
            flex: 1,
            sortable: false,
            renderCell: (params) => <ClassificationSelect score={params.row} />
        },

        {
            field: 'roundHandicap',
            headerName: 'Handicap',
            flex: 0.5,
            sortable: false,
            renderCell: (params) => <HandicapInput scoreId={params.row.id} initialValue={params.value ?? ''} />
        },

        { field: 'notes', headerName: 'Notes', flex: 1, sortable: true },

        {
            field: 'processedAt',
            headerName: 'Process Score',
            flex: 0.5,
            sortable: false,
            renderCell: (params) => <ProcessButton score={params.row} />
        },
    ]

    const rows = scores.map((score, idx) => ({
        id: score.id ?? idx, // Ensure each row has a unique id
        name: score.user.name,
        bowstyle: EnumMappings[score.bowstyle] || score.bowstyle,
        ageCategory: EnumMappings[score.ageCategory] || score.ageCategory,
        sex: score.sex !== undefined ? (EnumMappings[score.sex] || score.sex) : '',
        dateShot: new Date(score.dateShot).toLocaleDateString(),
        roundType: score.roundType,
        roundName: score.roundName,
        score: score.score,
        xs: score.xs,
        tens: score.tens,
        nines: score.nines,
        hits: score.hits,
        competitionLevel: EnumMappings[score.competitionLevel] || score.competitionLevel,
        roundClassification: score.roundClassification !== undefined ? (EnumMappings[score.roundClassification] || score.roundClassification) : '',
        roundIndoorClassification: score.roundIndoorClassification,
        roundOutdoorClassification: score.roundOutdoorClassification,
        roundHandicap: score.roundHandicap,
        notes: score.notes,
        processedAt: score.processedAt,

    }));

    return (
        <DataGrid
            rows={rows}
            columns={columns}
            getRowHeight={() => 'auto'}
            initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
                filter: {
                    filterModel: {
                        items: [
                            {
                                field: 'processedAt',
                                operator: 'isEmpty',
                                id: 1,
                            },
                        ],
                    },
                },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
        />
    );
}
