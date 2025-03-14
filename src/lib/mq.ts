import amqp from "amqplib";

let connection: amqp.ChannelModel | null = null;
let channel: amqp.Channel | null = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

async function init() {
  if (connection && channel) return { connection, channel };

  connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();

  return { connection, channel };
}

export async function publish(queue: string, message: string) {
  const { channel } = await init();
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
}

export async function consume(
  queue: string,
  onMessage: (msg: amqp.ConsumeMessage | null) => void,
) {
  const { channel } = await init();
  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, onMessage, { noAck: false });
}

export async function ack(msg: amqp.ConsumeMessage) {
  const { channel } = await init();
  channel.ack(msg);
}

export async function close() {
  if (channel) await channel.close();
  if (connection) await connection.close();
}
