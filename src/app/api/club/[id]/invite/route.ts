import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(req: NextRequest, context: any) {
  const clubId = context.params.id;
  const { archeryGBNumber, invitedBy } = await req.json();

  if (!clubId || !archeryGBNumber || !invitedBy) {
    return NextResponse.json({ error: "Missing clubId, archeryGBNumber, or invitedBy" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({ where: { archeryGBNumber } });

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
