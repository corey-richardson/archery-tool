import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/api/auth/authOptions";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const clubId = params.id;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const isAdmin = await prisma.clubMembership.findFirst({
    where: {
      clubId,
      userId: session.user.id,
      roles: { has: "ADMIN" },
    },
  });

  if (!isAdmin) {
    return NextResponse.json({ error: "Not authorised" }, { status: 403 });
  }
  
  const invites = await prisma.invite.findMany({
    where: {
      clubId,
      status: "PENDING",
    },
    include: {
      user: true,
      club: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ invites });
}
