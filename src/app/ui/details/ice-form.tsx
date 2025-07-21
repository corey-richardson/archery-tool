"use client";

import React, { useEffect, useState } from "react";

type Contact = {
    id: string;
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    relationshipType : string;
};

const EmergencyContactsForm = ({user} : any) => {

    const [ isLoading, setIsLoading ] = useState(true);
    const [ contacts, setContacts ] = useState<Contact[]>([]);

    const [ newContactName, setNewContactName ] = useState<string>("");
    const [ newContactPhone, setNewContactPhone ] = useState<string>("");
    const [ newContactEmail, setNewContactEmail ] = useState<string>("");
    const [ newContactRelationship, setNewContactRelationship ] = useState<string>("NOT_SET");


    useEffect(() => {
        async function fetchContacts() {
            const res = await fetch(`/api/ice-details?userId=${user.id}`);
            const data = await res.json();
            setContacts(data);
            setIsLoading(false);
        }
        fetchContacts();
    }, [user.id]);


    const handleContactChange = (index: number, field: keyof Contact, value: string) => {
        setContacts(prev =>
            prev.map((contact, i) =>
                i === index ? { ...contact, [field]: value } : contact
            )
        );
    };

    return ( 
        <div>
            <h3>Emergency Contact Details.</h3>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo adipisci aliquam, enim voluptate corrupti doloremque possimus, voluptatibus aliquid perspiciatis in maxime corporis voluptatem temporibus illo optio, maiores minus quaerat voluptates.</p>

            <h4>Add New Emergency Contact</h4>
            <form>
                <label>*Contact Name:</label>
                <input value={newContactName} onChange={e => setNewContactName(e.target.value)} required />

                <label>*Contact Phone Number:</label>
                <input value={newContactPhone} onChange={e => setNewContactPhone(e.target.value)} required />

                <label>Contact Email:</label>
                <input value={newContactEmail} onChange={e => setNewContactEmail(e.target.value)} type="email" required />

                <label>Relationship to Contact:</label>
                <select value={newContactRelationship} onChange={e => setNewContactRelationship(e.target.value)}>
                    <option value="NOT_SET" disabled>Please Select</option>
                    <option value="PARENT">Parent</option>
                    <option value="GUARDIAN">Guardian</option>
                    <option value="SPOUSE">Spouse</option>
                    <option value="SIBLING">Sibling</option>
                    <option value="FRIEND">Friend</option>
                    <option value="OTHER">Other</option>
                </select>

                <button type="submit">Add New Contact</button>
            </form>
            <hr />

            { isLoading && <p className="centred">Loading Emergency Contact Information...</p>}
            { !isLoading && contacts.length == 0 && <hr/> && <p className="centred">No existing Emergency Contacts found!</p> }
            { !isLoading && contacts.length > 0 && <hr/> && <h4>Existing Emergency Contacts</h4> }
            { !isLoading && contacts.length > 0 && (
                contacts.map((contact, idx) => (
                    <form key={contact.id}>
                        <label>*Contact Name:</label>
                        <input
                            value={contact.contactName}
                            onChange={e => handleContactChange(idx, "contactName", e.target.value)}
                            placeholder="Contact Name"
                            required
                        />

                        <label>*Contact Phone Number:</label>
                        <input
                            value={contact.contactPhone}
                            onChange={e => handleContactChange(idx, "contactPhone", e.target.value)}
                            placeholder="Contact Phone"
                            required
                        />

                        <label>Contact Email:</label>
                        <input
                            value={contact.contactEmail || ""}
                            onChange={e => handleContactChange(idx, "contactEmail", e.target.value)}
                            placeholder="Contact Email"
                            type="email"
                        />

                        <label>Relationship to Contact:</label>
                        <select
                            value={contact.relationshipType}
                            onChange={e => handleContactChange(idx, "relationshipType", e.target.value)}
                        >
                            <option disabled value="">Select Relationship</option>
                            <option value="PARENT">Parent</option>
                            <option value="GUARDIAN">Guardian</option>
                            <option value="SPOUSE">Spouse or Partner</option>
                            <option value="SIBLING">Sibling</option>
                            <option value="FRIEND">Friend</option>
                            <option value="OTHER">Other</option>
                        </select>

                        <div style={{ display: "flex", alignContent: "center", gap: "1.5rem" }}>
                            <button type="submit">Save Contact</button>
                            <button className="btn-secondary" type="submit">Delete Contact</button>
                        </div>
                    </form>
                ))
            )}
        </div>
     );
}
 
export default EmergencyContactsForm;