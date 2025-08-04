import { NextRequest, NextResponse } from 'next/server';
import indoorRounds from '@/app/lib/IndoorRounds.json';
import outdoorRounds from '@/app/lib/OutdoorRounds.json';
import { error } from 'console';

export async function GET(request: NextRequest) {

    // throw new Error("Simulated Error to test manual input");

    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        if (!type) {
            return NextResponse.json({ error: 'Type parameter is required' }, { status: 400 });
        }

        let rounds;

        if (type.toUpperCase() === 'INDOOR') {
            rounds = indoorRounds.map(round => ({
                name: round.name,
                codename: round.codename,
                body: round.body
            }));
        } else if (type.toUpperCase() === 'OUTDOOR') {
            rounds = outdoorRounds.map(round => ({
                name: round.name,
                codename: round.codename,
                body: round.body,
            }));
        } else {
            return NextResponse.json({ error: 'Type must be either "indoor" or "outdoor"' }, { status: 400 });
        }

        // Sort rounds alphabetically by name
        rounds.sort((a, b) => a.name.localeCompare(b.name));

        return NextResponse.json({ rounds });
    } catch (error) {
        console.error('Error fetching rounds:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
