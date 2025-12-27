import "dotenv/config";
import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = new Redis(REDIS_URL);

export const redisSubscriber = new Redis(REDIS_URL);

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err: Error) => {
  console.error("Redis connection error:", err);
});

redisSubscriber.on("connect", () => {
  console.log("Redis subscriber connected");
});

redisSubscriber.on("error", (err: Error) => {
  console.error("Redis subscriber error:", err);
});

export const enableKeyspaceNotifications = async () => {
  try {
    await redis.config("SET", "notify-keyspace-events", "Ex");
    console.log("Redis keyspace notifications enabled for expired keys");
  } catch (err) {
    console.error("Failed to enable keyspace notifications:", err);
    console.log(
      "Note: This may fail on managed Redis instances. Falling back to polling."
    );
  }
};
