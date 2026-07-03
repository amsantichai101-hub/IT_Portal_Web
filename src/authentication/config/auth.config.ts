import MicrosoftEntraID from "@auth/core/providers/microsoft-entra-id";
import { NextAuthConfig } from "next-auth";
import axios from "axios";

import { TokenOrError } from "./next-auth";
import { Permission, User, UserData } from "@/types/User";

export const authConfig = {
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_ENTRA_CLIENT_ID,
      clientSecret: process.env.AUTH_ENTRA_SECRET,
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_ENTRA_TENANT_ID}/v2.0`,
      authorization: {
        params: {
          scope:
            process.env.AUTH_ENTRA_SCOPE ??
            "openid profile email offline_access User.Read",
        },
      },
    }),
  ],

  secret: process.env.AUTH_SECRET,

  trustHost: true,

  session: {
    strategy: "jwt",
    maxAge: 3600,
    updateAge: 900,
  },

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    async jwt({ token, account }) {
      console.log("========== JWT CALLBACK ==========");
      console.log("[JWT] hasAccount:", Boolean(account));
      console.log("[JWT] token before:", token);
      console.log("[JWT] account:", account);

      if (account?.access_token) {
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExp: account.expires_at,
          refreshToken: account.refresh_token,
        };
      }

      if (
        token.accessTokenExp &&
        Date.now() < Number(token.accessTokenExp) * 1000
      ) {
        return token;
      }

      if (!token.refreshToken) {
        console.warn("[JWT] No refreshToken found. Return existing token.");
        return token;
      }

      try {
        const tokenRequestBody = new URLSearchParams({
          client_id: process.env.AUTH_ENTRA_CLIENT_ID!,
          client_secret: process.env.AUTH_ENTRA_SECRET!,
          grant_type: "refresh_token",
          refresh_token: String(token.refreshToken),
          scope:
            process.env.AUTH_ENTRA_SCOPE ??
            "openid profile email offline_access User.Read",
        });

        const response = await axios.post(
          `https://login.microsoftonline.com/${process.env.AUTH_ENTRA_TENANT_ID}/oauth2/v2.0/token`,
          tokenRequestBody,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const newToken: TokenOrError = response.data;

        return {
          ...token,
          accessToken: newToken.access_token,
          accessTokenExp: Math.floor(Date.now() / 1000 + newToken.expires_in),
          refreshToken: newToken.refresh_token ?? token.refreshToken,
        };
      } catch (error) {
        console.error("[JWT] refresh token failed:", error);

        return {
          ...token,
          tokenRefreshError: true,
        };
      }
    },

    async session({ session, token }) {
      console.log("========== SESSION CALLBACK ==========");
      console.log("[SESSION] session before:", session);
      console.log("[SESSION] token:", token);

      if (!token?.accessToken) {
        console.warn("[SESSION] No accessToken in token.");
        session.apiFirstLoad = true;
        session.apiError = true;
        return session;
      }

      try {
        const accessToken = token.accessToken;

        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

        const response = await axios.get<UserData>(
          `${process.env.USERAPI_ENDPOINT}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Origin: process.env.FE_ORIGIN,
            },
          }
        );

        if (response.status === 200) {
          const data: UserData = response.data;

          const userInfo: User = data.user;
          const permission: Permission = data.permission;

          session.userData = {
            user: {
              name: token.name!,
              email: token.email!,
              displayName: userInfo.displayName,
              initialFullName: userInfo.initialFullName,
            },
            permission: {
              isPRAdmin: permission.isPRAdmin,
              isPRiSolution: permission.isPRiSolution,
              isSystemConfig: permission.isSystemConfig,
            },
          };

          session.apiFirstLoad = false;
          session.apiError = false;
        } else {
          session.apiFirstLoad = false;
          session.apiError = true;
        }
      } catch (error) {
        console.error("[SESSION] USERAPI failed:", error);

        session.apiFirstLoad = true;
        session.apiError = true;
      }

      session.accessToken = token.accessToken;

      console.log("[SESSION] session after:", session);

      return session;
    },
  },
} satisfies NextAuthConfig;