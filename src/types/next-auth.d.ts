// import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role?: string;
    accountType?: string;
  }

  interface Session {
    user: {
      id: string;
      role?: string;
      accountType?: string;
    } & DefaultSession["user"];
    expires: string;
  }
}
