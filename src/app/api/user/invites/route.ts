import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

export async function GET() {
    await requireLoggedInUser();

    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { 
                id: true,
                archeryGBNumber: true 
            }
        });

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const whereConditions = {
            status: "PENDING" as const,
            OR: [
                { userId: currentUser.id },
                ...(currentUser.archeryGBNumber ? [{ archeryGBNumber: currentUser.archeryGBNumber }] : [])
            ]
        };

        const invites = await prisma.invite.findMany({
            where: whereConditions,
            include: {
                club: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                inviter: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({ invites });

    } catch (error) {
        console.error("Error fetching user invites:", error);
        return NextResponse.json(
            { error: "Failed to fetch invites" },
            { status: 500 }
        );
    }
}