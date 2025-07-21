import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { userId, contactName, contactPhone, contactEmail, relationshipType } = body;

    if (!userId || !contactName || !contactPhone) {
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
