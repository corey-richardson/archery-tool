import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

interface Membership {
    roles: string[];
}

export async function PATCH(req: Request) {
    const requestor = await requireLoggedInUser();

    const body = await req.json();
    const { id, ...updateData } = body;

    const isRecordsOrHigher = requestor.memberships.some((membership: Membership) =>
        membership.roles.includes("ADMIN") || membership.roles.includes("CAPTAIN") || membership.roles.includes("RECORDS")
    );

    if (!isRecordsOrHigher && requestor.id !== id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!id) {
        return NextResponse.json({message: "Missing user ID."}, { status: 400});
    }

    // Build the data object with only the fields that were provided
    const dataToUpdate: any = {
        updatedAt: new Date(),
    };

    // Only include fields that are actually provided in the request
    if (updateData.name !== undefined) dataToUpdate.name = updateData.name;
    if (updateData.email !== undefined) dataToUpdate.email = updateData.email;
    if (updateData.archeryGBNumber !== undefined) dataToUpdate.archeryGBNumber = updateData.archeryGBNumber || null;
    if (updateData.sex !== undefined) dataToUpdate.sex = updateData.sex || null;
    if (updateData.gender !== undefined) dataToUpdate.gender = updateData.gender || null;
    if (updateData.yearOfBirth !== undefined) dataToUpdate.yearOfBirth = updateData.yearOfBirth || null;
    if (updateData.defaultBowstyle !== undefined) dataToUpdate.defaultBowstyle = updateData.defaultBowstyle || null;

    // Validation only for fields being updated
    if (dataToUpdate.name !== undefined && (!dataToUpdate.name || dataToUpdate.name.trim() === "")) {
        return NextResponse.json({error: "Name cannot be empty."}, { status: 400});
    }

    if (dataToUpdate.email !== undefined && (!dataToUpdate.email || dataToUpdate.email.trim() === "")) {
        return NextResponse.json({error: "Email cannot be empty."}, { status: 400});
    }

    // Check email uniqueness only if email is being updated
    if (dataToUpdate.email !== undefined) {
        const existingEmail = await prisma.user.findFirst({
            where: {
                email: dataToUpdate.email,
                NOT: { id },
            },
        });
        if (existingEmail) {
            return NextResponse.json({ error: "Email is already in use." }, { status: 409 });
        }
    }

    // Check ArcheryGB number uniqueness only if it's being updated
    if (dataToUpdate.archeryGBNumber !== undefined && dataToUpdate.archeryGBNumber) {
        const existingAGB = await prisma.user.findFirst({
            where: {
                archeryGBNumber: dataToUpdate.archeryGBNumber,
                NOT: { id },
            },
        });
        if (existingAGB) {
            return NextResponse.json({ error: "That ArcheryGB Number is already associated with a user." }, { status: 409 });
        }
    }

    const updatedUser = await prisma.user.update({
        where: {
            id,
        },
        data: dataToUpdate
    });

    return NextResponse.json({ message: "User updated successfully.", user: updatedUser }, { status: 200 });
}
