import {
  defaultSession,
  getClientConfig,
  getSession,
  clientConfig,
} from "@/lib/auth";
import * as client from "openid-client";

/**
 * Route to handle the logout of the user
 * It redirects the user to the OpenID Provider's end session endpoint
 * For more information, see https://openid.net/specs/openid-connect-core-1_0.html
 **/
export async function GET() {
  const session = await getSession();
  const openIdClientConfig = await getClientConfig();
  const endSessionUrl = client.buildEndSessionUrl(openIdClientConfig, {
    post_logout_redirect_uri: clientConfig.post_logout_redirect_uri,
    id_token_hint: session.accessToken!,
  });
  session.isLoggedIn = defaultSession.isLoggedIn;
  session.accessToken = defaultSession.accessToken;
  session.userInfo = defaultSession.userInfo;
  session.codeVerifier = defaultSession.codeVerifier;
  session.state = defaultSession.state;
  await session.save();
  return Response.redirect(endSessionUrl.href);
}
