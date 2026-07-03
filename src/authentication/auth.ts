
import NextAuth from "next-auth";
import { authConfig } from "@/authentication/config/auth.config";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);

