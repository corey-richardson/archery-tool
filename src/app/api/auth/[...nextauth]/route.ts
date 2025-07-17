import prisma from "@/app/lib/prisma";
import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from 'next-auth/providers/github';
import { compare } from "bcryptjs";
import type { NextRequest } from 'next/server';
import type { User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { authOptions } from "../authOptions";

const authHandler = NextAuth(authOptions);

export async function GET(request: NextRequest) {
  return authHandler(request);
}

export async function POST(request: NextRequest) {
  return authHandler(request);
}
