import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { hash } from "bcryptjs";

export async function POST (req: Request) {
    console.log(req);
    const { name, email, password, accountType } = await req.json();

    if (!name || !email || !password || !accountType ) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email }});
    if (existingUser) { return NextResponse.json({ message: 'User already exists' }, { status: 409 }); }

    let role = "USER";
    if (accountType == "CLUB") {
        role = "ADMIN";
    }
    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword,
            accountType,
            role: role as any,
        }
    })

    return NextResponse.json({ message: 'User created' }, { status: 201 });
}
