import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// POST /api/invites/create
export async function POST(req: NextRequest) {
  const { clubId, archeryGBNumber, invitedBy } = await req.json();

  if (!clubId || !archeryGBNumber || !invitedBy) {
    return NextResponse.json({ error: "Missing clubId, archeryGBNumber, or invitedBy" }, { status: 400 });
  }

  // Check if user exists
  const user = await prisma.user.findFirst({ where: { archeryGBNumber } });

  // Check for existing invite
  const existingInvite = await prisma.invite.findFirst({
    where: {
      clubId,
      OR: [
        { archeryGBNumber },
        { userId: user?.id ?? undefined },
      ],
      status: "PENDING",
    },
  });
  if (existingInvite) {
    return NextResponse.json({ error: "Invite already exists for this user/number." }, { status: 409 });
  }

  // Create invite
  const invite = await prisma.invite.create({
    data: {
      clubId,
      userId: user?.id ?? null,
      archeryGBNumber,
      invitedBy,
      status: "PENDING",
    },
  });

  return NextResponse.json({ invite }, { status: 201 });
}
