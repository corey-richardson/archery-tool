import prisma from "@/app/lib/prisma";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from 'next-auth/providers/github';
import { compare } from "bcryptjs";
import type { User, Session } from "next-auth";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials?: { email: string; password: string }) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user?.hashedPassword) {
                    return null;
                }

                if (!user || !user.hashedPassword || !(await compare(credentials.password, user.hashedPassword))) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    defaultBowstyle: user.defaultBowstyle,
                    sex: user.sex,
                    yearOfBirth: user.yearOfBirth,
                };
            }
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),

    ],
    session: {
        strategy: "database",
    },
    callbacks: {
        async session({ session, user }: { session: Session; user: User }) {
            if (session.user && user) {
                const memberships = await prisma.clubMembership.findMany({
                    where: {
                        userId: user.id,
                    },
                    select: {
                        clubId: true,
                        roles: true,
                    },
                });
                session.user.id = user.id;
                session.user.memberships = memberships;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
