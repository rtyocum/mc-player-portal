import { getSession } from "@/lib/auth";

/**
 * API route to get the current session information
 * @returns The session information
 **/
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({});
    }
    return Response.json({
      user: session.user,
    });
  } catch (e) {
    return Response.json({ error: e }, { status: 500 });
  }
}
