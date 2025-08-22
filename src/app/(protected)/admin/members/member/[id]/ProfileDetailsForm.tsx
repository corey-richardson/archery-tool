"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import calculateAgeCategory from "@/app/lib/calculateAgeCategory";
import { EnumMappings } from "@/app/lib/enumMappings";

interface EditableFieldProps {
    value: string | number;
    onSave: (newValue: string) => void;
    placeholder?: string;
    type?: "text" | "number" | "email" | "tel";
    min?: string | number;
    max?: string | number;
    step?: string | number;
}

interface EditableSelectProps {
    value: string;
    onSave: (newValue: string) => void;
    options: string[];
    placeholder?: string;
}

const EditIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginLeft: "8px", color: "#666" }}
    >
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
);

const EditableField = ({ value, onSave, type = "text", min, max, step }: EditableFieldProps) => {
    const [ isEditing, setIsEditing ] = useState(false);
    const [ tempValue, setTempValue ] = useState(value);

    const handleSave = () => {
        onSave(String(tempValue));
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(value);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape") {
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <input
                type={type}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                autoFocus
                min={min}
                max={max}
                step={step}
                style={{
                    border: "1px solid #007bff",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    outline: "none",
                    background: "white"
                }}
            />
        );
    }

    return (
        <span
            onClick={() => setIsEditing(true)}
            style={{
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "4px",
                display: "inline-block",
                minWidth: "100px",
                border: "1px solid transparent",
                background: "transparent"
            }}
            title="Click to edit"
        >
            {value || "Click to edit"}
            <EditIcon />
        </span>
    );
};

const EditableSelect = ({ value, onSave, options, placeholder }: EditableSelectProps) => {
    const [ isEditing, setIsEditing ] = useState(false);
    const [ tempValue, setTempValue ] = useState(value);

    const handleSave = () => {
        onSave(tempValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(value);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape") {
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <select
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                autoFocus
                style={{
                    border: "1px solid #007bff",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    outline: "none",
                    background: "white",
                    minWidth: "150px"
                }}
            >
                <option value="">{placeholder || "Select..."}</option>
                {options.map(option => (
                    <option key={option} value={option}>
                        { EnumMappings[option] }
                    </option>
                ))}
            </select>
        );
    }

    return (
        <span
            onClick={() => setIsEditing(true)}
            style={{
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "4px",
                display: "inline-block",
                minWidth: "100px",
                border: "1px solid transparent",
                background: "transparent"
            }}
            title="Click to edit"
        >
            {EnumMappings[value] || value}
            <EditIcon />
        </span>
    );
};

export default function ProfileDetailsForm({ user }: { user: User }) {
    const [ profileData, setProfileData ] = useState({
        name: user.name || "",
        email: user.email || "",
        archeryGBNumber: user.archeryGBNumber || "",
        defaultBowstyle: user.defaultBowstyle || "",
        sex: user.sex || "",
        gender: user.gender || "",
        yearOfBirth: user.yearOfBirth || "",
        updatedAt: user.updatedAt || "",
        ageCategory: user.yearOfBirth ? calculateAgeCategory(user.yearOfBirth) : "SENIOR"
    });

    const [ error, setError ] = useState<string | null>(null);

    const handleSave = async (field: string, newValue: string, setError: any) => {
        setError(null);

        const currentValue = profileData[field as keyof typeof profileData];
        const normalisedNewValue = field === "yearOfBirth" ? Number(newValue) : newValue;
        const normalisedCurrentValue = field === "yearOfBirth" ? Number(currentValue) : currentValue;

        if (normalisedNewValue === normalisedCurrentValue) {
            return; // exit early if no change
        }

        try {
            const valueToSend = field === "yearOfBirth" ? Number(newValue) : newValue;

            const response = await fetch(`/api/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    [field]: valueToSend,
                })
            });

            if (!response.ok || response.status === 409) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update.");
            }

            setProfileData(prev => ({ ...prev, [field]: newValue, updatedAt: new Date() }));
        } catch (error) {
            setError((error as Error).message);
        }
    };

    return (
        <div
            style={{
                padding: "0 1rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem"
            }}
        >
            <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                    Name:
                </label>
                <EditableField
                    value={profileData.name}
                    onSave={(value) => handleSave("name", value, setError)}
                    placeholder="Enter name"
                />
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                    Email:
                </label>
                <EditableField
                    value={profileData.email}
                    onSave={(value) => handleSave("email", value, setError)}
                    type="email"
                    placeholder="Enter email"
                />
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                    Archery GB Number:
                </label>
                <EditableField
                    value={profileData.archeryGBNumber}
                    onSave={(value) => handleSave("archeryGBNumber", value, setError)}
                    placeholder="Enter Archery GB number"
                />
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                    Primary Bowstyle:
                </label>
                <EditableSelect
                    value={profileData.defaultBowstyle}
                    onSave={(value) => handleSave("defaultBowstyle", value, setError)}
                    options={[ "BAREBOW", "RECURVE", "COMPOUND", "LONGBOW", "TRADITIONAL", "OTHER" ]}
                    placeholder="Select bowstyle"
                />
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                    Sex:
                </label>
                <EditableSelect
                    value={profileData.sex}
                    onSave={(value) => handleSave("sex", value, setError)}
                    options={[ "MALE", "FEMALE", "NOT_SET" ]}
                />
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                    Pronouns:
                </label>
                <EditableField
                    value={profileData.gender}
                    onSave={(value) => handleSave("gender", value, setError)}
                    placeholder="Enter Pronouns"
                />
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                    Year of Birth:
                </label>
                <EditableField
                    value={profileData.yearOfBirth}
                    type="number"
                    step="1"
                    min="1900" max={new Date().getFullYear()}
                    onSave={(value) => handleSave("yearOfBirth", value, setError)}
                    placeholder="Enter Year of Birth"
                />
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                    Age Category:
                </label>
                <span style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    display: "inline-block",
                    minWidth: "100px",
                    border: "1px solid transparent",
                    background: "transparent"
                }}>
                    { profileData.yearOfBirth ? EnumMappings[calculateAgeCategory(Number(profileData.yearOfBirth))] || calculateAgeCategory(Number(profileData.yearOfBirth)) : EnumMappings["SENIOR"] }
                </span>
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                    Last Updated:
                </label>
                <span style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    display: "inline-block",
                    minWidth: "100px",
                    border: "1px solid transparent",
                    background: "transparent"
                }}>
                    { new Date(profileData.updatedAt).toLocaleString() }
                </span>
            </div>


            <p className="small centred">{ error && error }</p>
        </div>
    );
}