import { getClientConfig, clientConfig, sessionOptions } from "@/lib/auth";
import { NextRequest } from "next/server";
import * as jose from "jose";
import * as client from "openid-client";
import { cookies } from "next/headers";

/**
 * Route to handle the callback from the OpenID Provider
 * It exchanges the authorization code for tokens and authenticates the user
 * For more information, see https://openid.net/specs/openid-connect-core-1_0.html
 **/
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = request.nextUrl.searchParams.get("token") || undefined;
  const codeVerifier = client.randomPKCECodeVerifier();
  const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
  const openIdClientConfig = await getClientConfig();
  const parameters: Record<string, string> = {
    redirect_uri: clientConfig.redirect_uri,
    scope: clientConfig.scope,
    code_challenge: codeChallenge,
    code_challenge_method: clientConfig.code_challenge_method,
  };
  let state!: string;
  if (!openIdClientConfig.serverMetadata().supportsPKCE()) {
    state = client.randomState();
    parameters.state = state;
  }
  const redirectTo = client.buildAuthorizationUrl(
    openIdClientConfig,
    parameters,
  );

  const jwt = await new jose.EncryptJWT({
    inviteToken: token,
    codeVerifier: codeVerifier,
    state: state,
  })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setIssuer("mc.rtyocum.dev")
    .setAudience("mc.rtyocum.dev")
    .setExpirationTime("20m")
    .encrypt(sessionOptions.secret());

  cookieStore.set("portalpresession", jwt, {
    secure: sessionOptions.cookieOptions.secure,
    httpOnly: true,
    maxAge: 60 * 20,
    sameSite: "lax",
  });

  return Response.redirect(redirectTo.href);
}
