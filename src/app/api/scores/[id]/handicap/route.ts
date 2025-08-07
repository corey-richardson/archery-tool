import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { requireRecordsUserOrHigher } from "@/app/lib/server-utils";

interface Params {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: Params) {
    await requireRecordsUserOrHigher();
    
    try {
        const scoreId = params.id;
        const body = await request.json();
        const { roundHandicap } = body;

        if (!scoreId || roundHandicap === undefined || roundHandicap === null) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const updatedScore = await prisma.scores.update({
            where: { id: scoreId },
            data: { roundHandicap },
        });

        return NextResponse.json(updatedScore);
    } catch (error) {
        console.error('Failed to update roundHandicap:', error);
        return NextResponse.json({ error: 'Failed to update handicap' }, { status: 500 });
    }
}
