import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/app/lib/prisma";

export async function PUT(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const [, , , userId, clubId] = url.split('/'); // ['', 'api', 'user', userId, clubId, 'roles']

  const { roles } = await req.json();

  try {
    await prisma.clubMembership.update({
      where: { userId_clubId: { userId, clubId } },
      data: { roles },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update failed:', error);
    return NextResponse.json({ error: 'Failed to update roles' }, { status: 500 });
  }
}
