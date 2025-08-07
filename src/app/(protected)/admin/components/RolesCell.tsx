import { useEffect, useState } from "react";
import { EnumMappings } from '@/app/lib/enumMappings';

const ALL_ROLES = ['ADMIN', 'RECORDS', 'COACH', 'MEMBER'];

export default function RolesCell({ value, row, clubId, setError }: { value: string[], row: any, clubId: string, setError: (err: string|null) => void }) {

    const [localRoles, setLocalRoles] = useState<string[]>(value || []);
    const [selectError, setSelectError] = useState(false);

    useEffect(() => {
        setLocalRoles(value || []);
    }, [value]);

    const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRoles = Array.from(event.target.selectedOptions).map(opt => opt.value);
        event.target.disabled = true;
        setLocalRoles(selectedRoles);
        setSelectError(false);

        try {
            const response = await fetch(`/api/user/${row.userId}/${clubId}/roles`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roles: selectedRoles }),
            });

            if (response.status === 400 || response.status === 401) {
                const data = await response.json();
                setError(data.error || "Failed to update roles.");
                setLocalRoles(value || []);
                setSelectError(true);
            } else if (!response.ok) {
                setError("Failed to update roles.");
                setLocalRoles(value || []);
                setSelectError(true);
            } else if (response.ok) {
                setError(null);
            }
        } catch (error) {
            setError("Failed to update roles. (Network Error): " + error);
            setLocalRoles(value || []);
            setSelectError(true);
        } finally {
            event.target.disabled = false;
        }
    };

    return (
        <select
            multiple
            value={localRoles}
            onChange={handleChange}
            onBlur={() => {
                if (selectError) setLocalRoles(value || []);
            }}
            size={ALL_ROLES.length}
            style={{
                width: '100%',
                minHeight: '3em',
                fontSize: '0.9rem',
                padding: '4px',
                borderRadius: '4px',
                border: selectError ? '2px solid red' : '1px solid #ccc',
                backgroundColor: selectError ? '#ffeaea' : '#f9f9f9',
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
}