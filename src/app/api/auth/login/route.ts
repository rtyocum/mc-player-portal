import { getClientConfig, getSession, clientConfig } from "@/lib/auth";
import { NextRequest } from "next/server";
import * as client from "openid-client";

/**
 * Route to handle the callback from the OpenID Provider
 * It exchanges the authorization code for tokens and authenticates the user
 * For more information, see https://openid.net/specs/openid-connect-core-1_0.html
 **/
export async function GET(request: NextRequest) {
  const session = await getSession();
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

  session.inviteToken = token;
  session.codeVerifier = codeVerifier;
  session.state = state;
  await session.save();
  return Response.redirect(redirectTo.href);
}
