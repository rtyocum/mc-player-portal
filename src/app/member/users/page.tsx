import { prisma } from "@/lib/prisma";
import UsersContainer from "@/components/users/users-container";
import { VIEW_USERS } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function UsersPage() {
  const session = await getSession();
  const permission = session?.user.permission ?? 0;
  if (!(permission & VIEW_USERS)) {
    return redirect("/forbidden");
  }
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  return <UsersContainer users={users} />;
}
