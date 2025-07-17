import prisma from "@/app/lib/prisma";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from 'next-auth/providers/github';
import { compare } from "bcryptjs";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
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
        async jwt({ token, user }: { token: any; user?: any }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.accountType = user.accountType;
            }
            return token;
        },

        async session({ session, token }: { session: any; token: any }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.accountType = token.accountType;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const authHandler = NextAuth(authOptions);
export { authHandler as GET, authHandler as POST };
