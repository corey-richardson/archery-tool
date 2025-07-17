import prisma from "@/app/lib/prisma";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from 'next-auth/providers/github';
import { compare } from "bcryptjs";
import type { User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

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
                    role: user.role,
                    accountType: user.accountType,
                };
            }
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),

    ],
    session: {
        strategy: "jwt" as const,
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: User }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.accountType = user.accountType;
            }
            return token;
        },

        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.accountType = token.accountType as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};