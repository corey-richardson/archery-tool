import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

interface Membership {
    roles: string[];
}

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
