"use server";

import { getSession } from "@/lib/auth";
import { INVITE } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
export default async function createInvite() {
  const session = await getSession();
  const permission = session?.user.permission ?? 0;
  if (!session || !(permission & INVITE)) {
    return {
      token: null,
    };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const invite = await prisma.invite.create({
    data: {
      token,
      remainingUses: 1,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      owner: {
        connect: {
          uuid: session.user.uuid,
        },
      },
    },
  });

  return {
    token: invite.token,
  };
}
