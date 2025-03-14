"use server";

import { getSession } from "@/lib/auth";
import { ADD_INVITE, DELETE_INVITE } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";

type FormData = {
  remainingUses?: number;
  expiresAt?: Date;
  ownerId?: string;
};

export async function addInvite(data: FormData) {
  const session = await getSession();
  const permission = session?.user.permission ?? 0;

  if (!session || !(permission & ADD_INVITE)) {
    return;
  }

  const token = randomBytes(32).toString("hex");

  await prisma.invite.create({
    data: {
      token,
      remainingUses: data.remainingUses ?? 1,
      expiresAt: data.expiresAt ?? new Date(Date.now() + 1000 * 60 * 60 * 24),
      owner: {
        connect: {
          id: data.ownerId ?? undefined,
          uuid: data.ownerId === undefined ? session.user.uuid : undefined,
        },
      },
    },
  });

  revalidatePath("/member/invites");
}

export async function deleteInvite(id: string) {
  const session = await getSession();
  const permission = session?.user.permission ?? 0;

  if (!session || !(permission & DELETE_INVITE)) {
    return;
  }

  await prisma.invite.delete({
    where: { id },
  });
  revalidatePath("/member/invites");
}
