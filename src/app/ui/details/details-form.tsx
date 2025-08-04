"use client";

import calculateAgeCategory from "@/app/lib/calculateAgeCategory";
import React, { useCallback, useEffect, useState } from "react";
import { EnumMappings } from "@/app/lib/enumMappings";

// Component
const DetailsForm = ({userId} : any) => {
    // State
    const [ refreshFlag, setRefreshFlag] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ changesPending, setChangesPending ] = useState(false);

    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ archeryGBNumber, setArcheryGBNumber ] = useState("");
    const [ sex, setSex] = useState("NOT_SET");
    const [ gender, setGender ] = useState("");
    const [ yearOfBirth, setYearOfBirth ] = useState("")
    const [ ageCat, setAgeCat ] = useState("");
    const [ defaultBowstyle, setDefaultBowstyle] = useState("NOT_SET");
    const [ lastUpdated, setLastUpdated ] = useState("");
    const [ createdAt, setCreatedAt ] = useState("");

    // Placeholder
    const maxYear = null;

    // Effects
    useEffect(() => {
        async function fetchUser() {
            setIsLoading(true);
            const res = await fetch(`/api/user/${userId}`);
            const data = await res.json();
            setName(data.name ?? "");
            setEmail(data.email ?? "");
            setArcheryGBNumber(data.archeryGBNumber ?? "");
            setSex(data.sex ?? "NOT_SET");
            setGender(data.gender ?? "");
            setYearOfBirth(data.yearOfBirth ? String(data.yearOfBirth) : "");
            setDefaultBowstyle(data.defaultBowstyle ?? "NOT_SET");
            setLastUpdated(data.updatedAt ?? "...");
            setCreatedAt(data.createdAt ?? "...");
            setIsLoading(false);
        }

        fetchUser();

    }, [userId, refreshFlag]);

    useEffect(() => {
        const year = parseInt(yearOfBirth);
        setAgeCat(calculateAgeCategory(year, true));
    }, [yearOfBirth]);

    // Handlers
    const handleInputChange = useCallback(
        (setter: React.Dispatch<React.SetStateAction<string>>) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                setter(e.target.value);
                setChangesPending(true);
            },
        []
    );

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const updatedAt = new Date();
        const response = await fetch('/api/user/update', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: userId,
                name,
                email,
                archeryGBNumber,
                sex: sex === "NOT_SET" ? null : sex,
                gender: gender || null,
                yearOfBirth: yearOfBirth ? parseInt(yearOfBirth) : null,
                defaultBowstyle: defaultBowstyle === "NOT_SET" ? null : defaultBowstyle,
                updatedAt
            }),
        });
        if (response.ok) {
            setRefreshFlag(flag => !flag);
            setIsLoading(false);
            setChangesPending(false);
        }
    }

    // Render
    return (
        <div>
            <h3>My Details.</h3>
            <p className="centred">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius vitae facilis fuga voluptas autem, perspiciatis placeat, incidunt provident veniam eaque mollitia aliquam voluptate eos cumque officia illo consequuntur porro aperiam.</p>

            <form onSubmit={handleSubmit}>

                <label>*Name:</label>
                <input value={name ?? ""} onChange={ handleInputChange(setName) } required />

                <label>*Email:</label>
                <input value={email ?? ""} onChange={ handleInputChange(setEmail) } type="email" required />

                <label>Archery GB Number:</label>
                <input value={archeryGBNumber ?? ""} onChange={ handleInputChange(setArcheryGBNumber) } placeholder="1234567" />

                <label>Sex (as per AGB):</label>
                <select value={sex ?? "NOT_SET"} onChange={ handleInputChange(setSex) }>
                    <option value="NOT_SET" disabled>Please Select</option>
                    <option value="MALE">{ EnumMappings["MALE"] }</option>
                    <option value="FEMALE">{ EnumMappings["FEMALE"] }</option>
                </select>

                <label>Pronouns:</label>
                <input value={gender ?? ""} onChange={ handleInputChange(setGender) } placeholder="Optional"/>

                <label>Year of Birth:</label>
                <input
                    value={yearOfBirth ?? ""}
                    onChange={ handleInputChange(setYearOfBirth) }
                    type="number"
                    step="1"
                    min="1900" max={new Date().getFullYear()}
                    placeholder="Please Set"/>
                <input disabled value={ageCat ?? ""} />

                <label>Default Bowstyle:</label>
                <select value={defaultBowstyle ?? "NOT_SET"} onChange={ handleInputChange(setDefaultBowstyle) }>
                    <option disabled value="NOT_SET">Please Select</option>
                    <option value="BAREBOW">{ EnumMappings["BAREBOW"] }</option>
                    <option value="RECURVE">{ EnumMappings["RECURVE"] }</option>
                    <option value="COMPOUND">{ EnumMappings["COMPOUND"] }</option>
                    <option value="LONGBOW">{ EnumMappings["LONGBOW"] }</option>
                    <option value="TRADITIONAL">{ EnumMappings["TRADITIONAL"] }</option>
                    <option value="OTHER">{ EnumMappings["OTHER"] }</option>
                </select>

                { !isLoading && !changesPending && <button disabled>Save Details</button> }
                { !isLoading && changesPending && <button type="submit">Save Details</button> }
                { isLoading && <button disabled>Loading...</button> }

                { !isLoading && (
                    <p style={{"marginTop": "12px"}} className="small centred">
                        Your details were last updated at {
                            lastUpdated !== "..."
                                ? new Date(lastUpdated).toLocaleString()
                                : new Date(createdAt).toLocaleString()
                        }.
                    </p>
                )}
            </form>
        </div>
    );
}

export default DetailsForm;
