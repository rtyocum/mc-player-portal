import { prisma } from "@/lib/prisma";
import UsersContainer from "@/components/users/users-container";
import { authorizeUser } from "@/lib/auth";
import { VIEW_USERS } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  if (!(await authorizeUser(VIEW_USERS))) {
    return redirect("/forbidden");
  }
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  return <UsersContainer users={users} />;
}
