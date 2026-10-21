import { jest } from "@jest/globals";

// Setup Mock for credits BEFORE anything imports it
jest.unstable_mockModule("./credits.js", () => {
    return {
        deductCredits: jest.fn()
    };
});

jest.unstable_mockModule("./queue.js", () => {
    return {
        aiSyncQueue: {
            add: jest.fn().mockResolvedValue({ id: 'mock-job-id' } as never)
        },
        aiSyncWorker: {}
    };
});

// Mock the pg pool — these are route contract tests, not DB integration tests.
jest.unstable_mockModule("./db.js", () => {
    const query = jest.fn().mockResolvedValue({
        rows: [{ ListingKey: 'MLS-1', StandardStatus: 'Active', ListPrice: 250000, PostalCode: '48001', UnparsedAddress: '123 Main St', OwnerName: 'Jane Doe' }],
        rowCount: 1,
    } as never);
    return {
        query,
        getClient: jest.fn(),
        default: { end: jest.fn().mockResolvedValue(undefined as never) },
    };
});

// Mock the live skip-trace cascade (network providers) for route tests.
jest.unstable_mockModule("./skiptrace.js", () => {
    return {
        cascadeSkipTrace: jest.fn().mockResolvedValue({
            success: true,
            phones: ['+15551234567'],
            emails: ['owner@example.com'],
            providerUsed: 'B (Whitepages Pro)',
        } as never),
    };
});

const { deductCredits } = await import("./credits.js");
const { aiSyncQueue } = await import("./queue.js");
const { default: app } = await import("./app.js");
import request from 'supertest';

describe('OmniLead Nexus API', () => {

    afterAll(async () => {
        // Clean up connections so Jest exits cleanly
        const pool = (await import("./db.js")).default;
        await pool.end();
    });

    it('GET /health should return 200 OK', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual('OK');
    });

    it('GET /listings returns rows from the listings table', async () => {
        const res = await request(app).get('/listings?status=Active');
        expect(res.statusCode).toEqual(200);
        expect(res.body.data[0].StandardStatus).toEqual('Active');
        expect(res.body.count).toEqual(1);
    });

    it('POST /augmentpropertyrecord should fail without userId', async () => {
        const res = await request(app).post('/augmentpropertyrecord').send({
            listingKey: "MLS-1"
        });
        expect(res.statusCode).toEqual(400);
    });

    it('POST /augmentpropertyrecord runs live skip-trace and deducts credits', async () => {
        ((deductCredits as unknown) as jest.Mock<any>).mockResolvedValueOnce(true);

        const res = await request(app).post('/augmentpropertyrecord').send({
            userId: "user-123",
            listingKey: "MLS-1"
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body.data.OwnerName).toEqual('Jane Doe');
        expect(res.body.data.OwnerPhones).toEqual(['+15551234567']);
        expect(res.body.data.providerUsed).toContain('Whitepages');
        expect(deductCredits).toHaveBeenCalledWith("user-123", "premium_credits", 1, "Augment record: MLS-1");
    });

    it('POST /webhooks/ai-sync should return 202 Accepted immediately', async () => {
        const res = await request(app).post('/webhooks/ai-sync').send({
            userId: "user-123",
            targetListSize: 500,
            zipCode: "48001"
        });

        expect(res.statusCode).toEqual(202);
        expect(res.body.jobId).toEqual('mock-job-id');
        expect(aiSyncQueue.add).toHaveBeenCalledWith('ai-batch-sync', {
            userId: "user-123",
            targetListSize: 500,
            geofenceId: undefined,
            zipCode: "48001"
        });
    });
});
