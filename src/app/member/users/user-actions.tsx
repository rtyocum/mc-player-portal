"use server";

import { getSession } from "@/lib/auth";
import { publish } from "@/lib/mq";
import { DELETE_USER, EDIT_PERMISSIONS, EDIT_USER } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type FormData = {
  note?: string;
  permission?: number;
};

export async function updateUser(id: string, data: FormData) {
  // authorizeUser isn't good enough here because of the seperate EDIT_PERMISSIONS permission
  const session = await getSession();
  const permission = session?.user.permission ?? 0;

  if (!session || !(permission & EDIT_USER)) {
    return;
  }

  const canEditPermissions = (permission & EDIT_PERMISSIONS) !== 0;

  const user = await prisma.user.update({
    where: { id },
    data: {
      note: data.note,
      permission: canEditPermissions ? data.permission : undefined,
    },
  });

  await publish(
    "user.update",
    JSON.stringify({
      uuid: user.uuid,
      username: user.username,
      permission: user.permission,
    }),
  );

  revalidatePath("/member/users");
}

export async function deleteUser(id: string) {
  const session = await getSession();
  const permission = session?.user.permission ?? 0;

  if (!session || !(permission & DELETE_USER)) {
    return;
  }

  const user = await prisma.user.delete({
    where: { id },
  });
  await publish(
    "user.delete",
    JSON.stringify({
      uuid: user.uuid,
      username: user.username,
      permission: user.permission,
    }),
  );
  revalidatePath("/member/users");
}
