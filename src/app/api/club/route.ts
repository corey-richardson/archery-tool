import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

export async function GET(request: Request) {
    await requireLoggedInUser();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    try {
        const userClubs = await prisma.clubMembership.findMany({
            where: {
                userId: userId,
                endedAt: null,
            },
            include: {
                club: true,
                user: true,
            },
        });

        // Sort function
        const getRolePriority = (roles: string[]) => {
            if (roles.includes('ADMIN')) return 1;
            if (roles.includes('RECORDS')) return 2;
            if (roles.includes('COACH')) return 3;
            if (roles.includes('MEMBER')) return 4;
            return 5;
        };

        const clubs = userClubs
            .map(membership => ({
                ...membership.club,
                membershipDetails: {
                    roles: membership.roles,
                    joinedAt: membership.joinedAt,
                    membershipId: membership.id,
                },
                _rolePriority: getRolePriority(membership.roles),
            }))
            .sort((a, b) => a._rolePriority - b._rolePriority)
            .map(({ _rolePriority, ...club }) => club);

        return NextResponse.json({ clubs }, { status: 200 });

    } catch (error) {
        console.error('Error fetching user clubs:', error);
        return NextResponse.json({ error: "Failed to fetch clubs" }, { status: 500 }); // Go through other routes and add error handling!
    }
}

export async function POST (req: Request) {
    const { clubName, creatorId } = await req.json();

    if (!clubName) {
        return NextResponse.json({ message: "Missing Club Name" }, { status: 400 });
    }

    const existingclub = await prisma.club.findUnique({ where: { name: clubName }});
    if (existingclub) { return NextResponse.json({ message: 'A club with that name already exists' }, { status: 409 }); }

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
            roles: ["MEMBER", "ADMIN", ],
        }
    })

    return NextResponse.json({ createdClub }, { status: 201 });
}
