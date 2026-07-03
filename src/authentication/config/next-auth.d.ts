import "next-auth";
import type { JWT } from "next-auth/jwt";
import { Permission, UserData } from "@/types/User";
import { User } from "next-auth";

interface MicrosoftGraphUser {
  "@odata.context": string;
  businessPhones: string[];
  displayName: string | null;
  givenName: string | null;
  jobTitle: string | null;
  mail: string | null;
  mobilePhone: string | null;
  officeLocation: string | null;
  preferredLanguage: string | null;
  surname: string | null;
  userPrincipalName: string;
  id: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      name: string | null;
      email: string | null;
      image: string | null;
    } & MicrosoftGraphUser;
    userData: UserData;
    expires: string;
    accessToken: string;
    apiError: boolean | false;
    apiFirstLoad: boolean | false;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name: string | null;
    email: string | null;
    picture: string | null;
    sub: string;
    userDetails: MicrosoftGraphUser;
    iat: number;
    exp?: number;
    jti: string;
    accessToken: string;
    accessTokenExp?: number;
    refreshToken?: string;
    role: Permission
  }
}

interface TokenOrError {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}
