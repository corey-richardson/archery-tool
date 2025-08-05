import { DataGrid, GridColDef } from '@mui/x-data-grid';
import calculateAgeCategory from '@/app/lib/calculateAgeCategory';
import { EnumMappings } from '@/app/lib/enumMappings';

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
    yearOfBirth?: number | null;
  };
}

interface Club {
  id: string;
  name: string;
  members: Member[];
  club: Club;
}

const ALL_ROLES = ['ADMIN', 'RECORDS', 'COACH', 'MEMBER'];

export default function MemberManagement({ club }: { club: Club }) {
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1, sortable: true },
        { field: 'email', headerName: 'Email', flex: 1, sortable: true },
        { field: 'archeryGBNumber', headerName: 'ArcheryGB Number', flex: 1, sortable: true },
        { field: 'sex', headerName: 'Sex', flex: 0.5, sortable: true },
        { field: 'yearOfBirth', headerName: 'Year of Birth', flex: 0.7, sortable: true },
        { field: 'ageCategory', headerName: 'Age Category', flex: 0.8, sortable: true },

        {
            field: 'roles',
            headerName: 'Roles (Ctrl+Click to add)',
            flex: 1,
            sortable: false,
            renderCell: (params) => {
                const currentRoles: string[] = params.value || [];

                const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
                    const selectedRoles = Array.from(event.target.selectedOptions).map(opt => opt.value);
                    event.target.disabled = true;

                    try {
                        const response = await fetch(`/api/user/${params.row.userId}/${club.club.id}/roles`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ roles: selectedRoles }),
                        });

                        if (response.status === 400) {
                            const data = await response.json();
                            alert(data.error || "Failed to update roles.");
                        } else if (!response.ok) {
                            alert("Failed to update roles.");
                        }
                    } catch (error) {
                        alert("Failed to update roles. (Network Error)");
                    } finally {
                        event.target.disabled = false;
                    }
                };

                return (
                    <select
                        multiple
                        defaultValue={currentRoles}
                        onChange={handleChange}
                        size={ALL_ROLES.length}
                        style={{
                            width: '100%',
                            minHeight: '3em',
                            fontSize: '0.9rem',
                            padding: '4px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            backgroundColor: '#f9f9f9',
                            overflow: 'hidden',
                        }}
                    >
                        {ALL_ROLES.map((role) => (
                            <option key={role} value={role}>
                                {EnumMappings[role]}
                            </option>
                        ))}
                    </select>
                );
            },
        },

        { field: 'joinedAt', headerName: 'Joined', flex: 0.8, sortable: true },
        { field: 'endedAt', headerName: 'Ended', flex: 0.8, sortable: true },
        { field: 'status', headerName: 'Status', flex: 0.7, sortable: true },
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
                sex: member.user?.sex != null ? EnumMappings[member.user.sex] : '-',
                yearOfBirth: member.user?.yearOfBirth || '-',
                ageCategory:
          member.user?.yearOfBirth
              ? EnumMappings[calculateAgeCategory(member.user.yearOfBirth)]
              : EnumMappings["SENIOR"],
                roles: member.roles,
                joinedAt: member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : '-',
                endedAt: member.endedAt ? new Date(member.endedAt).toLocaleDateString() : '-',
                status: 'Active',
            };
        });

    return (
        <div style={{ width: '100%', marginTop: '1rem' }}>
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
        </div>
    );
}
