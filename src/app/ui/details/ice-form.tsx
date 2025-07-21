"use client";

import React, { useCallback, useEffect, useState } from "react";

type Contact = {
    id: string;
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    relationshipType : string;
};

const EmergencyContactsForm = ({user} : any) => {

    const [ contacts, setContacts ] = useState<Contact[]>([]);

    const [ isLoading, setIsLoading ] = useState(false);

    const [ newContactName, setNewContactName ] = useState<string>("");
    const [ newContactPhone, setNewContactPhone ] = useState<string>("");
    const [ newContactEmail, setNewContactEmail ] = useState<string>("");
    const [ newContactRelationship, setNewContactRelationship ] = useState<string>("NOT_SET");


    const fetchContacts = useCallback(async () => {
        const res = await fetch(`/api/ice-details/${user.id}`);
        const data = await res.json();
        setContacts(data);
    }, [user.id]);


    const handleContactChange = (index: number, field: keyof Contact, value: string) => {
        setContacts(prev =>
            prev.map((contact, i) =>
                i === index ? { ...contact, [field]: value } : contact
            )
        );
    };


    const handleUpdateExistingContact = async (contact: Contact) => {
        setIsLoading(true);
        const response = await fetch(`/api/ice-details/${contact.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact),
        });

        if (response.ok) {
            setIsLoading(false);
        }
    }


    const handleDeleteExistingContact = async (contactId: string) => {
        setIsLoading(true);
        const response = await fetch(`/api/ice-details/${contactId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            fetchContacts().then(e => setIsLoading(false));
        } 
    }


    const handleCreateNewContact = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const response = await fetch("/api/ice-details", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user.id,
                contactName: newContactName,
                contactPhone: newContactPhone,
                contactEmail: newContactEmail,
                relationshipType: newContactRelationship,
            }),
        });

        if (response.ok) {
            fetchContacts().then(e => {
                setNewContactName("");
                setNewContactPhone("");
                setNewContactEmail("");
                setNewContactRelationship("NOT_SET");
                setIsLoading(false);
            });
        }
    }


    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    return ( 
        <div>
            <h3>Emergency Contact Details.</h3>
            <p className="centred">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo adipisci aliquam, enim voluptate corrupti doloremque possimus, voluptatibus aliquid perspiciatis in maxime corporis voluptatem temporibus illo optio, maiores minus quaerat voluptates.</p>

            <hr />
            <h4>Add New Emergency Contact</h4>
            <form onSubmit={handleCreateNewContact}>
                <label>*Contact Name:</label>
                <input value={newContactName} onChange={e => setNewContactName(e.target.value)} required />

                <label>*Contact Phone Number:</label>
                <input value={newContactPhone} onChange={e => setNewContactPhone(e.target.value)} required />

                <label>Contact Email:</label>
                <input value={newContactEmail} onChange={e => setNewContactEmail(e.target.value)} type="email" />

                <label>Relationship to Contact:</label>
                <select value={newContactRelationship} onChange={e => setNewContactRelationship(e.target.value)}>
                    <option value="NOT_SET" disabled>Please Select</option>
                    <option value="PARENT">Parent</option>
                    <option value="GUARDIAN">Guardian</option>
                    <option value="SPOUSE">Partner or Spouse</option>
                    <option value="SIBLING">Sibling</option>
                    <option value="FRIEND">Friend</option>
                    <option value="OTHER">Other</option>
                </select>

                { !isLoading && <button type="submit">Add New Contact</button> }
                { isLoading && <button disabled>Adding...</button>}
            </form>
            <hr />

            { isLoading && <p className="centred">Loading Emergency Contact Information...</p>}
            { !isLoading && contacts.length == 0 && <hr/> && <p className="centred">No existing Emergency Contacts found!</p> }
            { !isLoading && contacts.length > 0 && <hr/> && <h4>Existing Emergency Contacts</h4> }
            { !isLoading && contacts.length > 0 && (
                contacts.map((contact, idx) => (
                    <div key={contact.id}>
                        <form onSubmit={e =>{
                            e.preventDefault();
                            handleUpdateExistingContact(contact);
                        }}>
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
                                <button 
                                    className="btn-secondary" 
                                    onClick={() => handleDeleteExistingContact(contact.id)}
                                >Delete Contact</button>
                            </div>
                        </form>
                        { idx < contacts.length - 1 && <hr /> }
                    </div>
                ))
            )}
        </div>
     );
}
 
export default EmergencyContactsForm;
