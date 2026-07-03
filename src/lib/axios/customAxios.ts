import { auth } from "@/authentication/auth";

const session = await auth();
const isServer = typeof window === "undefined";

export const baseHeader = {
  Authorization: `Bearer ${session?.accessToken}`,
  "Content-Type": "application/json",
  ...(isServer && {
    Origin: process.env.FE_ORIGIN
  })
};
