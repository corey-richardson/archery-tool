import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

export async function GET(request: Request) {
    await requireLoggedInUser();

    const { searchParams } = new URL(request.url);
    const sp = await searchParams;
    const userId = sp.get("userId");

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
            if (roles.includes("ADMIN")) return 1;
            if (roles.includes("CAPTAIN")) return 2;
            if (roles.includes("RECORDS")) return 3;
            if (roles.includes("COACH")) return 4;
            if (roles.includes("MEMBER")) return 5;
            return 5;
        };

        const clubs = await Promise.all(
            userClubs.map(async membership => {
                // Fetch users with ADMIN, CAPTAIN or RECORDS roles for this club
                const adminOrRecordsUsers = await prisma.clubMembership.findMany({
                    where: {
                        clubId: membership.club.id,
                        endedAt: null,
                        OR: [
                            { roles: { has: "ADMIN" } },
                            { roles: { has: "CAPTAIN" } },
                            { roles: { has: "RECORDS" } }
                        ]
                    },
                    include: {
                        user: true
                    }
                });

                return {
                    ...membership.club,
                    membershipDetails: {
                        roles: membership.roles,
                        joinedAt: membership.joinedAt,
                        membershipId: membership.id,
                    },
                    adminOrRecordsUsers: adminOrRecordsUsers.map(u => ({
                        id: u.user.id,
                        name: u.user.name,
                        highestRole: u.roles.includes("ADMIN")
                            ? "ADMIN"
                            : u.roles.includes("CAPTAIN")
                                ? "CAPTAIN"
                                : u.roles.includes("RECORDS")
                                    ? "RECORDS"
                                    : "?"
                    })),
                    _rolePriority: getRolePriority(membership.roles),
                };
            })
        );

        const sortedClubs = clubs
            .sort((a, b) => a._rolePriority - b._rolePriority)
            .map(({ _rolePriority, ...club }) => club);

        return NextResponse.json({ clubs: sortedClubs }, { status: 200 });

    } catch (error) {
        console.error("Error fetching user clubs:", error);
        return NextResponse.json({ error: "Failed to fetch clubs" }, { status: 500 });
    }
}


export async function POST (req: Request) {
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
