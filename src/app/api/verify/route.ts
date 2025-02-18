import { BLOCKED, JOIN_SERVER } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

/**
 * This route is used by the Minecraft server to check if a user is allowed to join the server
 * @param request The incoming request
 * @returns The response
 **/

// TODO: Add HMAC validation. We need to ensure that the request is coming from the Minecraft server
export async function POST(request: Request) {
  try {
    const { uuid } = await request.json();
    if (!uuid) {
      return Response.json({ error: "uuid is required" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { uuid } });
    if (user && user.permission === BLOCKED) {
      return Response.json(
        { error: "You are banned from this server" },
        { status: 403 },
      );
    }

    if (!user || !(user.permission & JOIN_SERVER)) {
      return Response.json(
        {
          error:
            "You do not have access to this server. This server is INVITE ONLY. If you have received an invite, you must login to the website to claim it.",
        },
        { status: 403 },
      );
    }
    return Response.json({ message: "Welcome to the server" });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
