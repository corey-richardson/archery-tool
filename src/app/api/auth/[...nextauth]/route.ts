import NextAuth from "next-auth";
import { authOptions } from "../authOptions";

/**
 * @swagger ignore
 */

const authHandler = NextAuth(authOptions);

export { authHandler as GET, authHandler as POST };
