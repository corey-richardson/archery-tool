import { DataGrid, GridColDef } from '@mui/x-data-grid';
import calculateAgeCategory from '@/app/lib/calculateAgeCategory';
import { EnumMappings } from '@/app/lib/enumMappings';
import { useState } from "react";
import RolesCell from './RolesCell';

interface Member {
  id: string;
  userId: string;
  roles: string[];
  joinedAt?: string;
  endedAt?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
    archeryGBNumber?: string;
    sex?: string | null;
    gender?: string | null
    yearOfBirth?: number | null;
  };
}

interface Club {
  id: string;
  name: string;
  members: Member[];
  club: Club;
}

export default function MemberManagement({ club }: { club: Club }) {
    const [ error, setError ] = useState<string | null>(null);

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1, sortable: true },
        { field: 'email', headerName: 'Email', flex: 1, sortable: true },
        { field: 'archeryGBNumber', headerName: 'ArcheryGB Number', flex: 1, sortable: true },
        { field: 'sex', headerName: 'Sex (+ Pronouns)', flex: 0.8, sortable: true },
        { field: 'yearOfBirth', headerName: 'Year of Birth', flex: 0.7, sortable: true },
        { field: 'ageCategory', headerName: 'Age Category', flex: 0.8, sortable: true },

        {
            field: 'roles',
            headerName: 'Roles (Ctrl+Click to add)',
            flex: 1,
            sortable: false,

            renderCell: (params) => (
                <RolesCell
                    value={params.value}
                    row={params.row}
                    clubId={club.club.id}
                    setError={setError}
                />
            ),

        },

        { field: 'joinedAt', headerName: 'Joined', flex: 0.8, sortable: true },
    ];

    const rows = club.members
        .filter((member) => !member.endedAt)
        .map((member) => {
            return {
                id: member.id,
                userId: member.userId,
                name: member.user?.name || 'Unknown',
                email: member.user?.email || 'Unknown',
                archeryGBNumber: member.user?.archeryGBNumber || '-',
                sex: member.user?.sex ? EnumMappings[member.user.sex] + (member.user?.gender ? ` (${member.user?.gender})`  : "") : "-",
                yearOfBirth: member.user?.yearOfBirth || '-',
                ageCategory:
          member.user?.yearOfBirth
              ? EnumMappings[calculateAgeCategory(member.user.yearOfBirth)]
              : EnumMappings["SENIOR"],
                roles: member.roles,
                joinedAt: member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : '-',
                endedAt: member.endedAt ? new Date(member.endedAt).toLocaleDateString() : '-',
            };
        });

    return (
        <div style={{ width: '100%', marginTop: '1rem', paddingBottom: "2rem" }}>
            <DataGrid
                rows={rows}
                getRowHeight={() => 'auto'}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10, page: 0 } }
                }}
                pageSizeOptions={[10, 25, 50]}
                disableRowSelectionOnClick
            />

            {error && <p className="small centred" style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
