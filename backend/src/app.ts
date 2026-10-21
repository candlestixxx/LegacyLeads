import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { deductCredits } from './credits.js';
import { aiSyncQueue } from './queue.js';
import { query } from './db.js';
import { cascadeSkipTrace } from './skiptrace.js';

const app = express();

app.use(cors());
app.use(express.json());

// JSON error handler: return JSON instead of HTML stack traces for body-parser errors
app.use((err: any, _req: any, res: any, next: any) => {
  if (err?.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  next(err);
});

// Basic health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', service: 'OmniLead Nexus API' });
});

/**
 * GET /listings
 * Query MLS listing data by status, price, zip code, and radius (PostGIS).
 * Backed by the `listings` table populated via the MLS ingestion gateway.
 */
app.get('/listings', async (req: Request, res: Response) => {
    try {
        const { status, minPrice, maxPrice, zipCode, radius, lat, lng, limit } = req.query;
        const params: any[] = [];
        const where: string[] = [];

        if (status) { params.push(status); where.push(`"StandardStatus" = $${params.length}`); }
        if (minPrice) { params.push(Number(minPrice)); where.push(`"ListPrice" >= $${params.length}`); }
        if (maxPrice) { params.push(Number(maxPrice)); where.push(`"ListPrice" <= $${params.length}`); }
        if (zipCode) { params.push(zipCode); where.push(`"PostalCode" = $${params.length}`); }
        if (lat && lng && radius) {
            params.push(Number(lat), Number(lng), Number(radius));
            where.push(`ST_DWithin(
                geom::geography,
                ST_SetSRID(ST_MakePoint($${params.length - 1}, $${params.length - 2}), 4326)::geography,
                $${params.length} * 1609.34
            )`);
        }

        params.push(Math.min(1000, Math.max(1, Number(limit) || 100)));
        const sql = `SELECT * FROM listings ${where.length ? 'WHERE ' + where.join(' AND ') : ''} LIMIT $${params.length}`;
        const result = await query(sql, params);

        res.json({ data: result.rows, count: result.rowCount });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * POST /augmentpropertyrecord
 * Trigger on-demand advanced skip tracing using usage credits.
 * Runs the live provider cascade (Twilio -> Whitepages -> PDL).
 */
app.post('/augmentpropertyrecord', async (req: Request, res: Response) => {
    try {
        const { userId, listingKey } = req.body;
        if (!userId || !listingKey) {
            return res.status(400).json({ error: 'Missing userId or listingKey' });
        }

        // 1. Attempt Atomic Credit Deduction
        await deductCredits(userId, 'premium_credits', 1, `Augment record: ${listingKey}`);

        // 2. Live skip-trace cascade against the listing's address
        const listingRes = await query('SELECT * FROM listings WHERE "ListingKey" = $1 LIMIT 1', [listingKey]);
        const listing = listingRes.rows?.[0];
        const address = listing?.UnparsedAddress || listing?.address || '';
        if (!address) {
            return res.status(404).json({ error: `Listing ${listingKey} not found or has no address` });
        }

        const traced = await cascadeSkipTrace(userId, address);

        res.json({
            success: true,
            data: {
                ListingKey: listingKey,
                OwnerName: listing?.OwnerName || listing?.owner_name || null,
                OwnerPhones: traced.phones,
                OwnerEmails: traced.emails,
                IsAbsenteeOwner: listing?.IsAbsenteeOwner ?? null,
                providerUsed: traced.providerUsed,
            }
        });
    } catch (e: any) {
        res.status(402).json({ error: 'Payment Required or Deduction Failed', details: e.message });
    }
});

/**
 * POST /webhooks/ai-sync
 * Asynchronously queues a large data sync for an AI Dialer integration.
 * Immediately returns 202 Accepted to prevent CRM/Agent timeouts.
 */
app.post('/webhooks/ai-sync', async (req: Request, res: Response) => {
    try {
        const { userId, targetListSize, geofenceId, zipCode } = req.body;

        if (!userId || !targetListSize) {
            return res.status(400).json({ error: 'Missing userId or targetListSize' });
        }

        // Push to BullMQ for asynchronous background processing
        const job = await aiSyncQueue.add('ai-batch-sync', {
            userId,
            targetListSize,
            geofenceId,
            zipCode
        });

        // Immediately release the connection
        res.status(202).json({
            message: 'Sync queued successfully',
            jobId: job.id
        });

    } catch (e: any) {
        res.status(500).json({ error: 'Failed to queue sync job', details: e.message });
    }
});

export default app;