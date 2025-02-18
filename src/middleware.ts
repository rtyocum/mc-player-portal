import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth";

/**
 * Middleware to check if the user is logged in
 * If the user is not logged in, redirect them to the login page
 * @param request The request object
 * @returns The response
 **/
export async function middleware(request: NextRequest) {
  const session = await getSession();
  if (!session || !session.isLoggedIn) {
    return NextResponse.rewrite(new URL("/api/auth/login", request.url));
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: "/member/:path*",
};
