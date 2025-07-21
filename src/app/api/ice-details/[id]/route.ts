import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: { id: string}}) {
    const contactId = params.id;
    const body = await request.json();

    if (!contactId) {
        console.log("No contactId");
        return NextResponse.json({error: "Missing contactId"}, {status: 400});
    }

    const updatedContact = await prisma.iceDetails.update({
        where: { id: contactId },
        data: {
            contactName: body.contactName,
            contactPhone: body.contactPhone,
            contactEmail: body.contactEmail,
            relationshipType: body.relationshipType,
        }
    });

    return NextResponse.json(updatedContact);
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string}}) {
    const contactId = params.id;

    if (!contactId) {
        console.log("No contactId");
        return NextResponse.json({error: "Missing contactId"}, {status: 400});
    }

    await prisma.iceDetails.delete({
        where: { id: contactId },
    });

    return NextResponse.json({ message: "Contact deleted." });
}
