import prisma from "@/app/lib/prisma";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from 'next-auth/providers/github';
import type { User, Session } from "next-auth";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
