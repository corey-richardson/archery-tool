import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser, requireRecordsUserOrHigher } from "@/app/lib/server-utils";

interface Membership {
    roles: string[];
}

export async function GET(request: NextRequest, context: any) {
    const user = await requireLoggedInUser();

    const params = await context.params;
    const userId = params.id;

    const isRecordsOrAdmin = user.memberships.some((membership : Membership) =>
        membership.roles.includes('ADMIN') || membership.roles.includes('RECORDS')
    );

    if (!isRecordsOrAdmin && user.id !== userId) {
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


export async function PATCH(request: NextRequest, context: any) {
    const user = await requireLoggedInUser();

    const params = await context.params;
    const contactId = params.id;
    const body = await request.json();

    const isRecordsOrAdmin = user.memberships.some((membership : Membership) =>
        membership.roles.includes('ADMIN') || membership.roles.includes('RECORDS')
    );

    if (!isRecordsOrAdmin && user.id !== body.userId) {
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
    const contactId = params.id;

    if (!contactId) {
        return NextResponse.json({error: "Missing contactId"}, {status: 400});
    }

    await prisma.iceDetails.delete({
        where: { id: contactId },
    });

    return NextResponse.json({ message: "Contact deleted." });
}
