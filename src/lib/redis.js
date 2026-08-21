import { createClient } from "redis";

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

const redis = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

redis.on("connect", () => {
  console.log(`Redis connecting to ${REDIS_HOST}:${REDIS_PORT}`);
});

redis.on("ready", () => {
  console.log(`Redis ready at ${REDIS_HOST}:${REDIS_PORT}`);
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

redis.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

export async function connectRedis() {
  if (redis.isOpen) {
    return;
  }

  try {
    await redis.connect();
    console.log("Redis connected successfully");
  } catch (error) {
    console.error("Failed to connect Redis:", error.message);
  }
}

export default redis;
