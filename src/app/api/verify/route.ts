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
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Permision checking will be done on the plugin side. Just return the user's permission level
    return Response.json({ permission: user.permission }, { status: 200 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
