import { Worker } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const redisConnection = {
  url: REDIS_URL, 
};

const emailWorker = new Worker("email-queue", async (job) => {
    console.log(`Processing job ${job.id}: ${job.name}`);
}, { 
    connection: {
        url: REDIS_URL
    }
});