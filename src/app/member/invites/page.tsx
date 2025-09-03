import { prisma } from "@/lib/prisma";
import InvitesContainer from "@/components/invites/invites-container";
import { VIEW_INVITES } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function UsersPage() {
  const session = await getSession();
  const permission = session?.user.permission ?? 0;
  if (!(permission & VIEW_INVITES)) {
    return redirect("/forbidden");
  }
  const invites = (
    await prisma.invite.findMany({
      include: {
        owner: { select: { id: true, username: true, picture: true } },
      },
      orderBy: { createdAt: "asc" },
    })
  ).map((invite) => ({
    id: invite.id,
    token: invite.token,
    remainingUses: invite.remainingUses,
    expiresAt: invite.expiresAt,
    ownerId: invite.owner.id,
    username: invite.owner.username,
    picture: invite.owner.picture,
  }));

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      picture: true,
    },
  });
  return (
    <InvitesContainer
      invites={invites}
      users={users}
      appUrl={process.env.APP_URL!}
    />
  );
}
