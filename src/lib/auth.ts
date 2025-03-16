import { cookies } from "next/headers";
import * as client from "openid-client";
import { prisma } from "./prisma";
import * as jose from "jose";

/**
 * Configuration for the OpenID Connect client
 **/
export const clientConfig = {
  issuer: process.env.AUTH_ISSUER_URL || "",
  audience: process.env.NEXT_PUBLIC_APP_URL || "",
  client_id: process.env.AUTH_CLIENT_ID || "",
  client_secret: process.env.AUTH_CLIENT_SECRET || "",
  scope: process.env.AUTH_SCOPE || "",
  redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL!}/api/auth/callback`,
  post_logout_redirect_uri: process.env.NEXT_PUBLIC_APP_URL! || "",
  response_type: "code",
  grant_type: "authorization_code",
  post_login_route: `${process.env.NEXT_PUBLIC_APP_URL || ""}/member/home`,
  login_forbidden_route: `${process.env.NEXT_PUBLIC_APP_URL || ""}/forbidden`,
  code_challenge_method: "S256",
};

export interface PreSessionData {
  inviteToken?: string;
  codeVerifier?: string;
  state?: string;
}

export interface SessionData {
  user: {
    uuid: string;
    username: string;
    name: string;
    email: string;
    picture: string;
    permission: number;
  };
}

export const sessionOptions = {
  cookieName: "portalsession",
  secret: jose.base64url.decode(process.env.AUTH_SESSION_SECRET!),
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
  ttl: 60 * 60 * 24 * 7, // 1 week
  maxSessions: 5, // Maximum number of sessions per user. old sessions will be deleted
};

export async function getSession(): Promise<SessionData | null> {
  const cookiesList = await cookies();
  const sessionCookie = cookiesList.get(sessionOptions.cookieName);
  if (sessionCookie === undefined) {
    return null;
  }
  const session = await prisma.session.findUnique({
    where: { token: sessionCookie.value },
    include: {
      user: {
        select: {
          uuid: true,
          username: true,
          name: true,
          email: true,
          picture: true,
          permission: true,
        },
      },
    },
  });
  if (
    session !== null &&
    session.user !== null &&
    session.expiresAt > new Date()
  ) {
    return { user: session.user };
  }

  return null;
}

/**
 * Function to get the OpenID Connect client configuration from the issuer
 * @returns The OpenID Connect client configuration
 **/
export async function getClientConfig() {
  return await client.discovery(
    new URL(clientConfig.issuer),
    clientConfig.client_id,
    clientConfig.client_secret,
  );
}
