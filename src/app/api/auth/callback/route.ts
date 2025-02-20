import {
  getClientConfig,
  clientConfig,
  sessionOptions,
  PreSessionData,
} from "@/lib/auth";
import { MEMBER } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";
import * as client from "openid-client";
import * as jose from "jose";
import { randomBytes } from "crypto";

type UserCreateParams = {
  uuid: string;
  username: string;
  name: string;
  email: string;
};

/**
 * Route to handle the callback from the OpenID Provider
 * It exchanges the authorization code for tokens and authenticates the user
 * For more information, see https://openid.net/specs/openid-connect-core-1_0.html#TokenEndpoint
 **/
export async function GET(request: NextRequest) {
  // Many of these functions can throw errors, so we wrap the entire function in a try-catch block, its the easiest way and denies by default
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("portalpresession");
    if (!jwt) {
      return Response.redirect(clientConfig.login_forbidden_route);
    }

    const preSession = await jose.jwtDecrypt<PreSessionData>(
      jwt.value,
      sessionOptions.secret,
      {
        audience: "mc.rtyocum.dev",
        issuer: "mc.rtyocum.dev",
      },
    );

    await clearPreSession();

    const { inviteToken } = preSession.payload;

    const tokenSet = await getAuthorizationCode(request, preSession.payload);

    const { access_token: msToken } = tokenSet;
    const claims = tokenSet.claims()!;

    const { profile } = await minecraftAuth(msToken);

    const dbUser = await prisma.user.findUnique({
      where: {
        uuid: profile.id,
      },
    });

    let user: User | undefined;

    // If the user does not exist and has an invite token, check if the invite is valid. If it is, create the user
    if (!dbUser && inviteToken) {
      user = await verifyAndUseInvite(inviteToken, {
        uuid: profile.id,
        username: profile.name,
        name: claims.name as string,
        email: claims.email as string,
      });

      // If the user exists, update the user information.
    } else if (dbUser) {
      user = await prisma.user.update({
        where: {
          uuid: profile.id,
        },
        data: {
          username: profile.name,
          name: claims.name as string,
          email: claims.email as string,
          picture: `https://minotar.net/avatar/${profile.id}`,
        },
      });
    }

    // If the user does not exist and does not have an invite token, set an unauthenticated session
    if (!user) {
      return Response.redirect(clientConfig.login_forbidden_route);
    }

    // Set the session information and redirect the user to the post-login route

    const sessionToken = randomBytes(32).toString("hex");
    await prisma.session.create({
      data: {
        token: sessionToken,
        expiresAt: new Date(Date.now() + sessionOptions.ttl * 1000),
        userId: user.id,
      },
    });

    cookieStore.set(sessionOptions.cookieName, sessionToken, {
      secure: sessionOptions.cookieOptions.secure,
      httpOnly: true,
      maxAge: sessionOptions.ttl,
      sameSite: "lax",
    });

    return Response.redirect(clientConfig.post_login_route);
  } catch {
    return Response.redirect(clientConfig.login_forbidden_route);
  }
}

/**
 * Function to get the authorization code from the request
 * @param request The request object
 * @returns The token set
 **/
async function getAuthorizationCode(
  request: NextRequest,
  { codeVerifier, state }: PreSessionData,
) {
  const openIdClientConfig = await getClientConfig();

  // Get the current URL
  const headerList = await headers();
  const host =
    headerList.get("x-forwarded-host") || headerList.get("host") || "localhost";
  const protocol = headerList.get("x-forwarded-proto") || "https";
  const currentUrl = new URL(
    `${protocol}://${host}${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  // Send a request to the OpenID Provider to exchange the code for tokens
  const tokenSet = await client.authorizationCodeGrant(
    openIdClientConfig,
    currentUrl,
    {
      pkceCodeVerifier: codeVerifier,
      expectedState: state,
    },
  );

  return tokenSet;
}

/**
 * Function to use an invite token to create a new user
 * @param inviteToken The invite token to use
 * @param userCreateParams The user create parameters
 * @returns The created user or undefined if the invite is invalid
 **/
async function verifyAndUseInvite(
  inviteToken: string,
  userCreateParams: UserCreateParams,
) {
  const invite = await prisma.invite.findUnique({
    where: {
      token: inviteToken,
    },
  });

  if (!invite) {
    return undefined;
  }

  if (invite.remainingUses === 0) {
    return undefined;
  }

  // Verify Exipration
  if (new Date() > invite.expiresAt) {
    return undefined;
  }

  await prisma.invite.update({
    where: {
      token: inviteToken,
    },
    data: {
      remainingUses: {
        decrement: 1,
      },
    },
  });

  const user = await prisma.user.create({
    data: {
      uuid: userCreateParams.uuid,
      username: userCreateParams.username,
      name: userCreateParams.name,
      email: userCreateParams.email,
      picture: `https://minotar.net/avatar/${userCreateParams.uuid}`,
      permission: MEMBER,
      acceptedInviteId: invite.id,
    },
  });

  return user;
}

/**
 * Function to authenticate a user with the Minecraft API
 * @param access_token The access token to authenticate with
 * @returns The Minecraft access token and profile
 * For more information, see https://minecraft.wiki/w/Mojang_API
 **/
async function minecraftAuth(access_token: string) {
  // Authenticate with Xbox Live
  const xboxTokenResponse = await fetch(
    "https://user.auth.xboxlive.com/user/authenticate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Properties: {
          AuthMethod: "RPS",
          SiteName: "user.auth.xboxlive.com",
          RpsTicket: `d=${access_token}`,
        },
        RelyingParty: "http://auth.xboxlive.com",
        TokenType: "JWT",
      }),
    },
  );

  const xboxToken = await xboxTokenResponse.json();
  const xboxLiveToken = xboxToken.Token as string;
  const userHash = xboxToken.DisplayClaims.xui[0].uhs as string;

  // Fetch XSTS Token
  const xstsResponse = await fetch(
    "https://xsts.auth.xboxlive.com/xsts/authorize",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Properties: {
          SandboxId: "RETAIL",
          UserTokens: [xboxLiveToken],
        },
        RelyingParty: "rp://api.minecraftservices.com/",
        TokenType: "JWT",
      }),
    },
  );
  const xstsToken = await xstsResponse.json();

  // Authenticate with Minecraft
  const minecraftResponse = await fetch(
    "https://api.minecraftservices.com/authentication/login_with_xbox",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identityToken: `XBL3.0 x=${userHash};${xstsToken.Token}`,
      }),
    },
  );
  const minecraftToken = await minecraftResponse.json();
  const minecraftAccessToken = minecraftToken.access_token as string;

  // Fetch Minecraft Profile Information
  const profileResponse = await fetch(
    "https://api.minecraftservices.com/minecraft/profile",
    {
      headers: {
        Authorization: `Bearer ${minecraftAccessToken}`,
      },
    },
  );

  const profile = await profileResponse.json();

  return {
    accessToken: minecraftAccessToken,
    profile,
  };
}

/**
 * Clear the pre-session cookie
 **/
async function clearPreSession() {
  const cookieStore = await cookies();
  cookieStore.delete("portalpresession");
}
