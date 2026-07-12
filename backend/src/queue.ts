import { Queue, Worker, Job } from 'bullmq';
import * as dotenv from 'dotenv';
import { deductCredits } from './credits.js';

dotenv.config();

// Ensure IORedis connection options are passed correctly to BullMQ
const redisConnection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
};

// 1. Initialize High-Throughput Job Queue
export const aiSyncQueue = new Queue('AI_Sync_Queue', {
    connection: redisConnection
});

// 2. Define the Worker process to handle the background jobs
export const aiSyncWorker = new Worker('AI_Sync_Queue', async (job: Job) => {
    const { userId, targetListSize, geofenceId } = job.data;
    console.log(`Processing AI Sync Job ${job.id} for User: ${userId}`);

    try {
        // Mock heavy DB geospatial query & skip-tracing cascade
        // This process might take several seconds or minutes for large boundaries
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Deduct batch credits after successful aggregation
        await deductCredits(userId, 'basic_credits', targetListSize, `AI Auto-Sync Batch. Target Size: ${targetListSize}`);

        console.log(`Successfully completed AI Sync Job ${job.id}`);
    } catch (e: any) {
        console.error(`Job ${job.id} failed:`, e.message);
        throw e; // Push job back into retry logic
    }
}, {
    connection: redisConnection,
    concurrency: 10 // Handle up to 10 concurrent heavy queries
});

aiSyncWorker.on('completed', (job: Job) => {
    console.log(`Worker reported job ${job.id} as completed.`);
});

aiSyncWorker.on('failed', (job: Job | undefined, err: Error) => {
    console.error(`Worker reported job ${job?.id} as failed:`, err);
});