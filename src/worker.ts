import { ack, consume } from "./lib/mq";
import { prisma } from "./lib/prisma";

consume("user.ban", async (msg) => {
  if (!msg) return;
  const data = JSON.parse(msg.content.toString());
  const uuid = data.uuid;

  const user = await prisma.user.findUnique({ where: { uuid } });
  if (!user) return;

  await prisma.user.update({
    where: { uuid },
    data: { permission: 0 },
  });

  ack(msg);
});

console.log("Worker started");
