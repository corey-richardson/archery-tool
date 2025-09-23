"use client";

import React, { useCallback, useEffect, useState } from "react";
import { EnumMappings } from "@/app/lib/enumMappings";

type Contact = {
    id: string;
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    relationshipType : string;
    updatedAt: string;
};

const EmergencyContactsForm = ({user} : any) => {

    const [ contacts, setContacts ] = useState<Contact[]>([]);

    const [ isLoading, setIsLoading ] = useState(false);
    const [ changesPending, setChangesPending ] = useState(false);

    const [ newContactName, setNewContactName ] = useState<string>("");
    const [ newContactPhone, setNewContactPhone ] = useState<string>("");
    const [ newContactEmail, setNewContactEmail ] = useState<string>("");
    const [ newContactRelationship, setNewContactRelationship ] = useState<string>("NOT_SET");
    const [ pendingChanges, setPendingChanges ] = useState<string[]>([]);

    // Foldable contact state: only one open at a time
    const [ openContactIdx, setOpenContactIdx ] = useState<number | null>(null);
    const toggleContact = (idx: number) => setOpenContactIdx(openContactIdx === idx ? null : idx);

    const fetchContacts = useCallback(async () => {
        const res = await fetch(`/api/emergency-contacts/user/${user.id}`);
        const data = await res.json();
        setContacts(data);
    }, [ user.id ]);


    const handleContactChange = (index: number, field: keyof Contact, value: string) => {
        setContacts(prev =>
            prev.map((contact, i) =>
                i === index ? { ...contact, [field]: value } : contact
            )
        );
        const contactId = contacts[index].id;
        setPendingChanges(prev => prev.includes(contactId) ? prev : [ ...prev, contactId ]);
    };


    const handleUpdateExistingContact = async (contact: Contact) => {
        setIsLoading(true);
        const response = await fetch(`/api/emergency-contacts/contact/${contact.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact),
        });

        if (response.ok) {
            setIsLoading(false);
            setPendingChanges(prev => prev.filter(id => id !== contact.id));
        }
    }


    const handleDeleteExistingContact = async (contactId: string) => {
        setIsLoading(true);
        const response = await fetch(`/api/emergency-contacts/contact/${contactId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            setContacts(prev => prev.filter(contact => contact.id !== contactId));
            setIsLoading(false);
        }
    }


    const handleCreateNewContact = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const response = await fetch(`/api/emergency-contacts/user/${user.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contactName: newContactName,
                contactPhone: newContactPhone,
                contactEmail: newContactEmail,
                relationshipType: newContactRelationship != "NOT_SET" ? newContactRelationship : null,
            }),
        });

        if (response.ok) {
            fetchContacts().then(() => {
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
    }, [ fetchContacts ]);

    return (
        <div>
            <h3>Emergency Contact Details.</h3>
            <p className="centred">
                Please provide up-to-date emergency contact details. This information is used by your club in case of urgent situations and will only be accessed by authorised officials. You can add, update, or remove contacts at any time. If you have privacy concerns, contact your club administrator.
            </p>

            <h4>Add New Emergency Contact</h4>
            <form onSubmit={handleCreateNewContact}>
                <label>*Contact Name:</label>
                <input value={newContactName} onChange={e => {
                    setNewContactName(e.target.value);
                    setChangesPending(true);
                }} required />

                <label>*Contact Phone Number:</label>
                <input value={newContactPhone} onChange={e => {
                    setNewContactPhone(e.target.value);
                    setChangesPending(true);
                }} required />

                <label>Contact Email:</label>
                <input value={newContactEmail} onChange={e => {
                    setNewContactEmail(e.target.value);
                    setChangesPending(true);
                }} type="email" />

                <label>Relationship to Contact:</label>
                <select value={newContactRelationship} onChange={e => {
                    setNewContactRelationship(e.target.value);
                    setChangesPending(true);
                }}>
                    <option value="NOT_SET" disabled>Please Select</option>
                    <option value="PARENT">{ EnumMappings["PARENT"] }</option>
                    <option value="GRANDPARENT">{ EnumMappings["GRANDPARENT"] }</option>
                    <option value="GUARDIAN">{ EnumMappings["GUARDIAN"] }</option>
                    <option value="SPOUSE">{ EnumMappings["SPOUSE"] }</option>
                    <option value="SIBLING">{ EnumMappings["SIBLING"] }</option>
                    <option value="FRIEND">{ EnumMappings["FRIEND"] }</option>
                    <option value="OTHER">{ EnumMappings["OTHER"] }</option>
                </select>

                { !changesPending && <button disabled>Add New Contact</button> }
                { !isLoading && changesPending && <button type="submit">Add New Contact</button> }
                { isLoading && <button disabled>Adding...</button>}
            </form>
            <hr />

            { isLoading && <p className="centred">Loading Emergency Contact Information...</p>}
            { !isLoading && contacts.length == 0 && <hr/> && <p className="centred">No existing Emergency Contacts found!</p> }
            { !isLoading && contacts.length > 0 && <hr/> && <h4>Existing Emergency Contacts</h4> }

            { !isLoading && contacts.length > 0 && (
                contacts.map((contact, idx) => (
                    <div key={contact.id} className={`emergency-contact-card${openContactIdx === idx ? " open" : ""}`}>
                        <button
                            type="button"
                            onClick={() => toggleContact(idx)}
                            className="emergency-contact-toggle btn-secondary"
                            aria-expanded={openContactIdx === idx}
                            aria-controls={`contact-details-${contact.id}`}
                        >
                            <span className="emergency-contact-toggle-details">
                                <span className="emergency-contact-toggle-icon">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: "middle" }}>
                                        {openContactIdx === idx ? (
                                            <path d="M5 13L10 8L15 13" stroke="#356df1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        ) : (
                                            <path d="M5 8L10 13L15 8" stroke="#356df1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        )}
                                    </svg>
                                </span>
                                <span className="emergency-contact-toggle-name">{contact.contactName}</span>
                                <span className="emergency-contact-toggle-relationship">
                                    ({EnumMappings[contact.relationshipType] || contact.relationshipType})
                                </span>
                            </span>
                            <span className="emergency-contact-toggle-action">{openContactIdx === idx ? "Hide details" : "Show details"}</span>
                        </button>

                        {openContactIdx === idx && (
                            <form id={`contact-details-${contact.id}`} onSubmit={e =>{
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
                                    value={contact.relationshipType || "NOT_SET"}
                                    onChange={e => handleContactChange(idx, "relationshipType", e.target.value)}
                                >
                                    <option value="NOT_SET" disabled>Please Select</option>
                                    <option value="PARENT">{ EnumMappings["PARENT"] }</option>
                                    <option value="GRANDPARENT">{ EnumMappings["GRANDPARENT"] }</option>
                                    <option value="GUARDIAN">{ EnumMappings["GUARDIAN"] }</option>
                                    <option value="SPOUSE">{ EnumMappings["SPOUSE"] }</option>
                                    <option value="SIBLING">{ EnumMappings["SIBLING"] }</option>
                                    <option value="FRIEND">{ EnumMappings["FRIEND"] }</option>
                                    <option value="OTHER">{ EnumMappings["OTHER"] }</option>
                                </select>

                                <div style={{ display: "flex", alignContent: "center", gap: "1.5rem" }}>
                                    { !isLoading && pendingChanges.includes(contact.id) && <button type="submit" style={{ alignSelf: "center" }}>Update Contact</button> }
                                    { !isLoading && !pendingChanges.includes(contact.id) && <button disabled style={{ alignSelf: "center" }}>Update Contact</button> }
                                    { isLoading && <button disabled style={{ alignSelf: "center" }}>Updating...</button> }
                                    <button
                                        className="btn-secondary"
                                        style={{ alignSelf: "center" }}
                                        onClick={() => handleDeleteExistingContact(contact.id)}
                                    >Delete Contact</button>
                                </div>

                                <p style={{"marginTop": "12px"}} className="small centred">
                                    These details were last updated at { new Date(contact.updatedAt).toLocaleString() }. Are they still in date?
                                </p>
                            </form>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default EmergencyContactsForm;
