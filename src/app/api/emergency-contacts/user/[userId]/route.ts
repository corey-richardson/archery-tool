import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

interface Membership {
    roles: string[];
}

/**
 * @swagger
 * /api/emergency-contacts/user/{userId}:
 *   post:
 *     operationId: createEmergencyContact
 *     tags:
 *       - Emergency Contacts
 *     summary: Create a new emergency contact for a user
 *     description: >
 *       Adds a new emergency contact for the specified user.
 *       Requires a logged-in user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contactName
 *               - contactPhone
 *             properties:
 *               contactName:
 *                 type: string
 *               contactPhone:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *               relationshipType:
 *                 type: string
 *     responses:
 *       201:
 *         description: Emergency contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmergencyContact'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     security:
 *       - SessionAuth: []
 *
 *   get:
 *     operationId: listEmergencyContacts
 *     tags:
 *       - Emergency Contacts
 *     summary: List emergency contacts for a user
 *     description: >
 *       Returns all emergency contacts for the specified user.
 *       Requires the user to be ADMIN, CAPTAIN, RECORDS, or the owner of the contacts.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user
 *     responses:
 *       200:
 *         description: List of emergency contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EmergencyContact'
 *       400:
 *         description: Missing userId
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
 *     security:
 *       - SessionAuth: []
 */

export async function POST(request: NextRequest, context: any) {
    await requireLoggedInUser();

    const params = await context.params;
    const userId = params.userId;

    const body = await request.json();
    const { contactName, contactPhone, contactEmail, relationshipType } = body;

    if (!contactName || !contactPhone) {
        return NextResponse.json({error: "Missing required fields"}, { status: 400 });
    }

    const newContact = await prisma.iceDetails.create({
        data: {
            userId,
            contactName,
            contactPhone,
            contactEmail,
            relationshipType,
        }
    });

    return NextResponse.json(newContact, { status: 201 });
}

export async function GET(request: NextRequest, context: any) {
    const user = await requireLoggedInUser();

    const params = await context.params;
    const userId = params.userId;

    const isRecordsOrHigher = user.memberships.some((membership : Membership) =>
        membership.roles.includes("ADMIN") || membership.roles.includes("CAPTAIN") || membership.roles.includes("RECORDS")
    );

    if (!isRecordsOrHigher && user.id !== userId) {
        return NextResponse.json({ error: "Unauthorised" }, { status: 403 });
    }

    if (!userId) {
        return NextResponse.json({ error: "Missing userId"}, { status: 400 });
    }

    const emergencyContacts = await prisma.iceDetails.findMany({
        where: { userId }
    });

    return NextResponse.json(emergencyContacts);
}
