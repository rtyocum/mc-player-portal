import { defaultSession, getSession } from "@/lib/auth";

/**
 * API route to get the current session information
 * @returns The session information
 **/
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ defaultSession });
    }
    return Response.json({
      isLoggedIn: session.isLoggedIn,
      userInfo: session.userInfo,
    });
  } catch (e) {
    return Response.json({ error: e }, { status: 500 });
  }
}
