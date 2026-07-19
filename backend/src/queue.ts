import { Queue, Worker, Job } from 'bullmq';
import * as dotenv from 'dotenv';
import { deductCredits } from './credits.js';
import { isWithinLegalCallHours } from './compliance.js';
import { cascadeSkipTrace } from './skiptrace.js';

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
    const { userId, targetListSize, geofenceId, zipCode } = job.data;
    console.log(`Processing AI Sync Job ${job.id} for User: ${userId}`);

    try {
        // 1. TCPA Compliance Guardrail
        if (zipCode && !isWithinLegalCallHours(zipCode)) {
             throw new Error(`TCPA Violation Guard: Job paused. Target timezone for zip ${zipCode} is currently outside legal 8 AM - 8 PM calling hours.`);
        }

        // 2. Mock heavy DB geospatial query
        await new Promise(resolve => setTimeout(resolve, 500));

        // 3. Trigger Smart Skip-Trace Cascade for the lead
        const leadAddress = '8910 Pineview Dr'; // Mock extracted from DB
        const traceResult = await cascadeSkipTrace(userId, leadAddress);

        // 4. Deduct base pulling credits
        await deductCredits(userId, 'basic_credits', targetListSize, `AI Auto-Sync Batch. Target Size: ${targetListSize}`);

        console.log(`Successfully completed AI Sync Job ${job.id}. Trace used provider: ${traceResult.providerUsed}`);
    } catch (e: any) {
        console.error(`Job ${job.id} failed/paused:`, e.message);
        throw e; // Push job back into retry logic (BullMQ will auto-retry when quiet hours expire if configured)
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