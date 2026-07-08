import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();

// High-speed queue and caching layer for OmniLead Nexus
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Self-executing connection for instant availability
(async () => {
    try {
        await redisClient.connect();
        console.log("Redis connected successfully.");
    } catch (e) {
        console.error("Failed to connect to Redis initially:", e);
    }
})();


export default redisClient;