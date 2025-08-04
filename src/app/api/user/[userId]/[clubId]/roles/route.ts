import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/app/lib/prisma";
import { error } from 'console';

export async function PUT(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const [, , , userId, clubId] = url.split('/'); // ['', 'api', 'user', userId, clubId, 'roles']

  const { roles } = await req.json();

  try {
    const existingMemberships = await prisma.clubMembership.findUnique({
      where: { userId_clubId: { userId, clubId } },
    });

    const isRemovingAdmin = existingMemberships?.roles.includes("ADMIN") && !roles.includes("ADMIN");

    if (isRemovingAdmin) {
      const adminCount = await prisma.clubMembership.count({
        where: {
          clubId,
          roles: {  has: "ADMIN" },
          NOT: {userId },
        }
      });
      
      if (adminCount == 0) {
        return NextResponse.json(
          { error: "Cannot remove the last admin from the club." },
          { status: 400 }
        );
      }
    }

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
