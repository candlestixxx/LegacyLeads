import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { deductCredits } from './credits.js';

const app = express();

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', service: 'OmniLead Nexus API' });
});

/**
 * GET /listings
 * Query state-level MLS scraped lists filtering by statuses, min/max price, zip codes, and base radiuses.
 */
app.get('/listings', async (req: Request, res: Response) => {
    try {
        const { status, minPrice, maxPrice, zipCode } = req.query;
        // MOCK: In production this will translate into a complex PostGIS + PostgreSQL query.
        res.json({
            data: [
                {
                    ListingKey: "MOCK-123",
                    StandardStatus: status || "Active",
                    ListPrice: minPrice || 250000,
                    PostalCode: zipCode || "48001"
                }
            ],
            count: 1
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * POST /augmentpropertyrecord
 * Trigger on-demand advanced skip tracing using usage credits.
 */
app.post('/augmentpropertyrecord', async (req: Request, res: Response) => {
    try {
        const { userId, listingKey } = req.body;
        if (!userId || !listingKey) {
            return res.status(400).json({ error: 'Missing userId or listingKey' });
        }

        // 1. Attempt Atomic Credit Deduction
        await deductCredits(userId, 'premium_credits', 1, `Augment record: ${listingKey}`);

        // 2. MOCK: Smart Skip-Tracing Cascade Engine Action (Provider A -> B -> C)
        const mockAugmentedData = {
            ListingKey: listingKey,
            OwnerName: 'John Doe',
            OwnerPhones: ['555-0100', '555-0101'],
            OwnerEmails: ['john.doe@example.com'],
            IsAbsenteeOwner: true
        };

        res.json({ success: true, data: mockAugmentedData });
    } catch (e: any) {
        res.status(402).json({ error: 'Payment Required or Deduction Failed', details: e.message });
    }
});

export default app;