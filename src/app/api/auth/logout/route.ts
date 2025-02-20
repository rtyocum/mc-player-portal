import { getClientConfig, clientConfig, sessionOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import * as client from "openid-client";

/**
 * Route to handle the logout of the user
 * It redirects the user to the OpenID Provider's end session endpoint
 * For more information, see https://openid.net/specs/openid-connect-core-1_0.html
 **/
export async function GET() {
  const cookiesList = await cookies();
  const sessionCookie = cookiesList.get(sessionOptions.cookieName);
  if (sessionCookie === undefined) {
    return Response.redirect(clientConfig.post_logout_redirect_uri);
  }

  const openIdClientConfig = await getClientConfig();
  const endSessionUrl = client.buildEndSessionUrl(openIdClientConfig, {
    post_logout_redirect_uri: clientConfig.post_logout_redirect_uri,
  });

  cookiesList.delete(sessionOptions.cookieName);

  await prisma.session.delete({
    where: { token: sessionCookie.value },
  });

  return Response.redirect(endSessionUrl.href);
}
