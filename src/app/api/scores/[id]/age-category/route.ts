import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { requireRecordsUserOrHigher } from "@/app/lib/server-utils";

interface Params {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: Params) {
    await requireRecordsUserOrHigher();
    const p = await params;

    try {
        const scoreId = p.id;
        const body = await request.json();
        const { ageCategory } = body;

        if (!scoreId || ageCategory === undefined || ageCategory === null) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const updatedScore = await prisma.scores.update({
            where: { id: scoreId },
            data: { ageCategory },
        });

        return NextResponse.json(updatedScore);
    } catch (error) {
        console.error('Failed to update ageCategory:', error);
        return NextResponse.json({ error: 'Failed to update ageCategory' }, { status: 500 });
    }
}
