"use server";

import { authorizeUser, getSession } from "@/lib/auth";
import { DELETE_USER, EDIT_PERMISSIONS, EDIT_USER } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type FormData = {
  note?: string;
  permission?: number;
};

export async function authorizeUserEdit() {
  const session = await getSession();
  if (session.isLoggedIn) {
    const permission = await prisma.user.findUnique({
      where: { uuid: session.userInfo?.uuid },
      select: { permission: true },
    });

    const canEdit =
      permission && (permission.permission & EDIT_USER) === EDIT_USER;

    const canEditPermissions =
      permission &&
      (permission.permission & EDIT_PERMISSIONS) === EDIT_PERMISSIONS;

    return {
      canEdit,
      canEditPermissions,
    };
  }
  return {
    canEdit: false,
    canEditPermissions: false,
  };
}

export async function updateUser(id: string, data: FormData) {
  // authorizeUser isn't good enough here because of the seperate EDIT_PERMISSIONS permission
  const { canEdit, canEditPermissions } = await authorizeUserEdit();
  if (!canEdit) {
    return;
  }

  await prisma.user.update({
    where: { id },
    data: {
      note: data.note,
      permission: canEditPermissions ? data.permission : undefined,
    },
  });

  revalidatePath("/member/users");
}

export async function deleteUser(id: string) {
  if (!(await authorizeUser(DELETE_USER))) {
    return;
  }
  await prisma.user.delete({
    where: { id },
  });
  revalidatePath("/member/users");
}
