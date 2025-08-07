import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

interface Membership {
    roles: string[];
}

export async function PATCH(req: Request) {
    const requestor = await requireLoggedInUser();

    const { id, name, email, archeryGBNumber, sex, gender, yearOfBirth, defaultBowstyle  } = await req.json();

    const isRecordsOrAdmin = requestor.memberships.some((membership: Membership) => 
        membership.roles.includes('ADMIN') || membership.roles.includes('RECORDS')
    );

    if (!isRecordsOrAdmin && requestor.id !== id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!id || !name || !email) {
        return NextResponse.json({message: "Missing required fields."}, { status: 400});
    }

    const existingEmail = await prisma.user.findFirst({
        where: {
            email,
            NOT: { id },
        },
    });
    if (existingEmail) {
        return NextResponse.json({ message: "Email is already in use." }, { status: 409 });
    }

    if (archeryGBNumber) {
        const existingAGB = await prisma.user.findFirst({
            where: {
                archeryGBNumber,
                NOT: { id },
            },
        });
        if (existingAGB) {
            return NextResponse.json({ message: "That ArcheryGB Number is already associated with a user." }, { status: 409 });
        }
    }

    const updatedUser = await prisma.user.update({
        where: {
            id,
        },
        data: {
            name,
            email,
            archeryGBNumber,
            sex: sex ? sex : null,
            gender: gender ? gender : null,
            yearOfBirth: yearOfBirth ? yearOfBirth : null,
            defaultBowstyle: defaultBowstyle ? defaultBowstyle : null,
            updatedAt: new Date(),
        }
    });

    return NextResponse.json({ message: "User updated successfully.", user: updatedUser }, { status: 200 });
}
