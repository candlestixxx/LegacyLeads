import { jest } from "@jest/globals";

// Setup Mock for credits BEFORE anything imports it
jest.unstable_mockModule("./credits.js", () => {
    return {
        deductCredits: jest.fn()
    };
});

const { deductCredits } = await import("./credits.js");
const { default: app } = await import("./app.js");
import request from 'supertest';
import pool from './db.js';
import redisClient from './redis.js';

describe('OmniLead Nexus API', () => {

    afterAll(async () => {
        // Clean up connections so Jest exits cleanly
        await pool.end();
        redisClient.disconnect();
    });

    it('GET /health should return 200 OK', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual('OK');
    });

    it('GET /listings should return mocked property data', async () => {
        const res = await request(app).get('/listings?status=Active');
        expect(res.statusCode).toEqual(200);
        expect(res.body.data[0].StandardStatus).toEqual('Active');
        expect(res.body.count).toEqual(1);
    });

    it('POST /augmentpropertyrecord should fail without userId', async () => {
        const res = await request(app).post('/augmentpropertyrecord').send({
            listingKey: "MOCK-123"
        });
        expect(res.statusCode).toEqual(400);
    });

    it('POST /augmentpropertyrecord should succeed and deduct credits', async () => {
        ((deductCredits as unknown) as jest.Mock<any>).mockResolvedValueOnce(true);

        const res = await request(app).post('/augmentpropertyrecord').send({
            userId: "user-123",
            listingKey: "MOCK-123"
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body.data.OwnerName).toEqual('John Doe');
        expect(deductCredits).toHaveBeenCalledWith("user-123", "premium_credits", 1, "Augment record: MOCK-123");
    });
});
