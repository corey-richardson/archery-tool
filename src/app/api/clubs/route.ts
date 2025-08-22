import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

export async function POST (req: Request) {
    await requireLoggedInUser();

    const { clubName, creatorId } = await req.json();

    if (!clubName) {
        return NextResponse.json({ message: "Missing Club Name" }, { status: 400 });
    }

    const existingclub = await prisma.club.findUnique({ where: { name: clubName }});
    if (existingclub) { return NextResponse.json({ message: "A club with that name already exists" }, { status: 409 }); }

    const createdClub = await prisma.club.create({
        data: {
            name: clubName,
        }
    });

    if (!createdClub) return NextResponse.json({ error: "Failed to create club." }, { status: 500 });

    await prisma.clubMembership.create({
        data: {
            userId: creatorId,
            clubId: createdClub.id,
            roles: [ "MEMBER", "ADMIN", ],
        }
    })

    return NextResponse.json({ createdClub }, { status: 201 });
}
