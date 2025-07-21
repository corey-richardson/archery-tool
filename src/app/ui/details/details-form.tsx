"use client";

import React, { useEffect, useState } from "react";

const DetailsForm = ({userId} : any) => {

    const [ refreshFlag, setRefreshFlag] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ changesPending, setChangesPending ] = useState(false);

    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ sex, setSex] = useState("");
    const [ gender, setGender ] = useState("");
    const [ yearOfBirth, setYearOfBirth ] = useState("")
    const [ defaultBowstyle, setDefaultBowstyle] = useState("");
    const [ lastUpdated, setLastUpdated ] = useState("NEVER");

    useEffect(() => {
        async function fetchUser() {
            const res = await fetch(`/api/user?userId=${userId}`);
            const data = await res.json();
            
            setName(data.name || "");
            setEmail(data.email || "");
            setSex(data.sex || "");
            setGender(data.gender || "");
            setYearOfBirth(data.yearOfBirth || "");
            setDefaultBowstyle(data.defaultBowstyle || "");
            setLastUpdated(data.updatedAt || "NEVER");
        }
        fetchUser();
    }, [userId, refreshFlag])

    const maxYear = new Date().getFullYear() - 18;

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

    return ( 
        <div>
            <h3>My Details.</h3>
            <p className="centred">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius vitae facilis fuga voluptas autem, perspiciatis placeat, incidunt provident veniam eaque mollitia aliquam voluptate eos cumque officia illo consequuntur porro aperiam.</p>
            <hr />

            <form onSubmit={handleSubmit}>
                <label>*Name:</label>
                <input value={name} onChange={e => {
                    setName(e.target.value)
                    setChangesPending(true);
                }} required />
                
                <label>*Email:</label>
                <input value={email} onChange={e => {
                    setEmail(e.target.value)
                    setChangesPending(true);
                }} type="email" required />

                <label>Sex (as per AGB):</label>
                <select value={sex || "NOT_SET"} onChange={e => {
                    setSex(e.target.value)
                    setChangesPending(true);
                }}>
                    <option value="NOT_SET" disabled>Please Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                </select>

                <label>Pronouns:</label>
                <input value={gender} onChange={e => {
                    setGender(e.target.value)
                    setChangesPending(true);
                }} placeholder="Please Set"/>

                <label>Year of Birth:</label>
                <input value={yearOfBirth} onChange={e => {
                    setYearOfBirth(e.target.value)
                    setChangesPending(true);
                }} type="number" step="1" min="1900" max={maxYear} placeholder="Please Set"/>

                <label>Default Bowstyle:</label>
                <select value={defaultBowstyle || "NOT_SET"} onChange={e => {
                    setDefaultBowstyle(e.target.value)
                    setChangesPending(true);
                }}>
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

                <p style={{"marginTop": "12px"}} className="small centred">Your details were last updated {
                    lastUpdated !== "NEVER"
                    ? "at " + new Date(lastUpdated).toLocaleString()
                    : "NEVER"
                }.</p>
            </form>
        </div>
     );
}
 
export default DetailsForm;