"use client";

import calculateAgeCategory from "@/app/lib/calculateAgeCategory";
import React, { useEffect, useState } from "react";

// Component
const DetailsForm = ({userId} : any) => {
    // State
    const [ refreshFlag, setRefreshFlag] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ changesPending, setChangesPending ] = useState(false);

    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ sex, setSex] = useState("");
    const [ gender, setGender ] = useState("");
    const [ yearOfBirth, setYearOfBirth ] = useState("")
    const [ ageCat, setAgeCat ] = useState("");
    const [ defaultBowstyle, setDefaultBowstyle] = useState("NOT_SET");
    const [ lastUpdated, setLastUpdated ] = useState("NEVER");

    // Placeholder
    const maxYear = null;

    // Effects
    useEffect(() => {
        async function fetchUser() {
            const res = await fetch(`/api/user?userId=${userId}`);
            const data = await res.json();
            setName(data.name ?? "");
            setEmail(data.email ?? "");
            setSex(data.sex ?? "");
            setGender(data.gender ?? "");
            setYearOfBirth(data.yearOfBirth ? String(data.yearOfBirth) : "");
            setDefaultBowstyle(data.defaultBowstyle ?? "NOT_SET");
            setLastUpdated(data.updatedAt ?? "NEVER");
        }
        fetchUser();
        
    }, [userId, refreshFlag]);

    useEffect(() => {
        const year = parseInt(yearOfBirth);
        setAgeCat(calculateAgeCategory(year, true));
    }, [yearOfBirth]);

    // Handlers
    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setter(e.target.value);
        setChangesPending(true);
    };

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
            <hr />

            <form onSubmit={handleSubmit}>

                <label>*Name:</label>
                <input value={name ?? ""} onChange={ handleInputChange(setName) } required />

                <label>*Email:</label>
                <input value={email ?? ""} onChange={ handleInputChange(setEmail) } type="email" required />

                <label>Sex (as per AGB):</label>
                <select value={sex ?? "NOT_SET"} onChange={ handleInputChange(setSex) }>
                    <option value="NOT_SET" disabled>Please Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
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
                    <option value="NOT_SET" disabled>Please Select</option>
                    <option value="BAREBOW">Barebow</option>
                    <option value="RECURVE">Recurve</option>
                    <option value="COMPOUND">Compound</option>
                    <option value="LONGBOW">Longbow</option>
                    <option value="TRADITIONAL">Traditional</option>
                </select>

                { !isLoading && !changesPending && <button disabled>Save Details</button> }
                { !isLoading && changesPending && <button type="submit">Save Details</button> }
                { isLoading && <button disabled>Loading...</button> }

                <p style={{"marginTop": "12px"}} className="small centred">
                    Your details were last updated {
                    lastUpdated !== "NEVER"
                    ? "at " + new Date(lastUpdated).toLocaleString()
                    : "NEVER"
                    }.
                </p>
            </form>
        </div>
     );
}
 
export default DetailsForm;
