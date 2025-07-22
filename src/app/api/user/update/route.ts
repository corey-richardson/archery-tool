import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function PATCH(req: Request) {
    const { id, name, email, sex, gender, yearOfBirth, defaultBowstyle  } = await req.json();

    if (!id || !name || !email) {
        return NextResponse.json({message: "Missing required fields."}, { status: 400});
    }

    const updatedUser = await prisma.user.update({
        where: {
            id,
        },
        data: {
            name,
            email,
            sex: sex ? sex : null,
            gender: gender ? gender : null,
            yearOfBirth: yearOfBirth ? yearOfBirth : null,
            defaultBowstyle: defaultBowstyle ? defaultBowstyle : null,
            updatedAt: new Date(),
        }
    });

    return NextResponse.json({ message: "User updated successfully.", user: updatedUser }, { status: 200 });
}
