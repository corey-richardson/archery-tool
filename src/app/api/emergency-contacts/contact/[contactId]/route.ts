import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

interface Membership {
    roles: string[];
}

/**
 * @swagger
 * /api/emergency-contacts/contact/{contactId}:
 *   patch:
 *     operationId: updateEmergencyContact
 *     tags:
 *       - Emergency Contacts
 *     summary: Update an emergency contact
 *     description: >
 *       Updates the specified emergency contact.
 *       Requires the user to be ADMIN, CAPTAIN, or RECORDS, or the owner of the contact.
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the emergency contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - contactName
 *               - contactPhone
 *               - contactEmail
 *               - relationshipType
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user this contact belongs to
 *               contactName:
 *                 type: string
 *               contactPhone:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *               relationshipType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Emergency contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmergencyContact'
 *       400:
 *         description: Missing contactId or required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Unauthorised
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     operationId: deleteEmergencyContact
 *     tags:
 *       - Emergency Contacts
 *     summary: Delete an emergency contact
 *     description: Deletes the specified emergency contact by ID
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the emergency contact
 *     responses:
 *       200:
 *         description: Emergency contact deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contact deleted.
 *       400:
 *         description: Missing contactId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to delete contact
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     security:
 *       - SessionAuth: []
 */

export async function PATCH(request: NextRequest, context: any) {
    const user = await requireLoggedInUser();

    const params = await context.params;
    const contactId = params.contactId;
    const body = await request.json();

    const isRecordsOrHigher = user.memberships.some((membership : Membership) =>
        membership.roles.includes("ADMIN") || membership.roles.includes("CAPTAIN") || membership.roles.includes("RECORDS")
    );

    if (!isRecordsOrHigher && user.id !== body.userId) {
        return NextResponse.json({ error: "Unauthorised" }, { status: 403 });
    }

    if (!contactId) {
        return NextResponse.json({error: "Missing contactId"}, {status: 400});
    }

    const updatedContact = await prisma.iceDetails.update({
        where: { id: contactId },
        data: {
            contactName: body.contactName,
            contactPhone: body.contactPhone,
            contactEmail: body.contactEmail,
            relationshipType: body.relationshipType,
            updatedAt: new Date(),
        }
    });

    return NextResponse.json(updatedContact);
}


export async function DELETE(request: NextRequest, context: any) {
    const params = await context.params;
    const contactId = params.contactId;

    if (!contactId) {
        return NextResponse.json({error: "Missing contactId"}, {status: 400});
    }

    await prisma.iceDetails.delete({
        where: { id: contactId },
    });

    return NextResponse.json({ message: "Contact deleted." });
}
