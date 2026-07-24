import { getClient } from './db.js';

export interface DeduplicationResult {
    isDuplicate: boolean;
    mergedKey?: string;
}

/**
 * Global Deduplication and Record Stitching Engine
 * Uses latitude/longitude clusters and fuzzy address matching to identify
 * if a lead already exists in the global database (even if under a different status).
 */
export async function stitchAndDeduplicate(
    listingKey: string,
    latitude: number,
    longitude: number,
    unparsedAddress: string
): Promise<DeduplicationResult> {
    const client = await getClient();
    try {
        // 1. PostGIS Bounding Box check within a 5-meter radius
        const geoQuery = `
            SELECT listing_key, unparsed_address FROM properties
            WHERE ST_DWithin(geom, ST_MakePoint($1, $2)::geography, 5)
        `;
        const geoResult = await client.query(geoQuery, [longitude, latitude]);

        if (geoResult.rows.length > 0) {
            // Found a spatial duplicate, verify via address string similarity
            for (const row of geoResult.rows) {
                // If it is identically the exact same property key, skip merging (it's an update)
                if (row.listing_key === listingKey) return { isDuplicate: false };

                // In production, we'd use a Levenshtein distance check or Trigram match here
                if (row.unparsed_address.substring(0, 10).toLowerCase() === unparsedAddress.substring(0, 10).toLowerCase()) {
                    console.log(`Deduplication Engine: Stitched new record ${listingKey} into existing ${row.listing_key}`);
                    return { isDuplicate: true, mergedKey: row.listing_key };
                }
            }
        }
        return { isDuplicate: false };
    } catch (e: any) {
        console.error("Deduplication logic failed", e);
        return { isDuplicate: false }; // fail open
    } finally {
        client.release();
    }
}
