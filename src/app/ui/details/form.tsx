"use client";

import React, { useState } from "react";

const DetailsForm = ({user} : any) => {
    const maxYear = new Date().getFullYear() - 18;

    const [ name, setName ] = useState(user.name);
    const [ email, setEmail ] = useState(user.email);
    const [ sex, setSex] = useState(user.sex);
    const [ gender, setGender ] = useState(user.gender);
    const [ yearOfBirth, setYearOfBirth ] = useState(user.yearOfBirth)
    const [ defaultBowstyle, setDefaultBowstyle] = useState(user.defaultBowstlye);

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        const updatedAt = new Date();
        
        // const response = await fetch('/api/user/update', {
        //     method: 'PATCH',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         name,
        //         email,
        //         sex: sex === "NOT_SET" ? null : sex,
        //         gender: gender || null,
        //         yearOfBirth: yearOfBirth ? parseInt(yearOfBirth) : null,
        //         defaultBowstyle: defaultBowstyle === "NOT_SET" ? null : defaultBowstyle,
        //         updatedAt
        //     }),
        // });
        //
        // if (response.ok) {
        //  ???
        // }
    }

    return ( 
        <div>
            <h3>My Details.</h3>
            <p className="centred">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius vitae facilis fuga voluptas autem, perspiciatis placeat, incidunt provident veniam eaque mollitia aliquam voluptate eos cumque officia illo consequuntur porro aperiam.</p>

            <form onSubmit={handleSubmit}>
                <label>*Name:</label>
                <input value={name} onChange={e => setName(e.target.value)} required />
                
                <label>*Email:</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />

                <label>Sex (as per AGB):</label>
                <select value={sex || "NOT_SET"} onChange={e => setSex(e.target.value)}>
                    <option value="NOT_SET" disabled>Please Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                </select>

                <label>Gender:</label>
                <input value={gender} onChange={e => setGender(e.target.value)} placeholder="Please Set"/>

                <label>Year of Birth:</label>
                <input value={yearOfBirth} onChange={e => setYearOfBirth(e.target.value)} type="number" step="1" min="1900" max={maxYear} placeholder="Please Set"/>

                <label>Default Bowstyle:</label>
                <select value={defaultBowstyle || "NOT_SET"} onChange={e => setDefaultBowstyle(e.target.value)}>
                    <option value="NOT_SET" disabled>Please Select</option>
                    <option value="BAREBOW">Barebow</option>
                    <option value="RECURVE">Recurve</option>
                    <option value="COMPOUND">Compound</option>
                    <option value="LONGBOW">Longbow</option>
                    <option value="TRADITIONAL">Traditional</option>
                </select>

                <button type="submit">Save Changes?</button>
            </form>
        </div>
     );
}
 
export default DetailsForm;