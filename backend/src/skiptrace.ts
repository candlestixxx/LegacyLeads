import { deductCredits } from './credits.js';

export interface SkipTraceResult {
    success: boolean;
    phones: string[];
    emails: string[];
    providerUsed: string;
}

/**
 * Smart Skip-Tracing Cascade Engine
 * If Provider A fails, immediately rolls over to Provider B, then C.
 * Dynamically charges credits based on which provider ultimately succeeds.
 *
 * LIVE PROVIDERS (env-configured, no fabricated results):
 *   A — Twilio Lookup (cheapest, phone intelligence)
 *       SKIP_TRACE_TWILIO_ACCOUNT_SID + SKIP_TRACE_TWILIO_AUTH_TOKEN
 *   B — Whitepages Pro (mid cost, person + address enrichment)
 *       SKIP_TRACE_WHITEPAGES_API_KEY
 *   C — PeopleDataLabs (deep search, full contact enrichment)
 *       SKIP_TRACE_PDL_API_KEY
 *
 * If a provider is not configured it is skipped without charging credits.
 * If NO provider is configured the cascade throws a configuration error —
 * it never invents phone numbers or emails.
 *
 * @param userId - Requesting User
 * @param address - Unparsed address to skip trace
 */
export async function cascadeSkipTrace(userId: string, address: string): Promise<SkipTraceResult> {
    // 1. Attempt Primary Provider (Lowest Cost: 0.5 Credits)
    let result = await providerTwilioLookup(address);
    if (result.success) {
        await deductCredits(userId, 'premium_credits', 0.5, 'Cascade: Twilio Lookup Success');
        return result;
    }

    // 2. Fallback to Premium Provider B (Mid Cost: 1.0 Credits)
    result = await providerWhitepagesPro(address);
    if (result.success) {
        await deductCredits(userId, 'premium_credits', 1.0, 'Cascade: Whitepages Pro Success');
        return result;
    }

    // 3. Fallback to Deep Search Provider C (High Cost: 2.0 Credits)
    result = await providerPeopleDataLabs(address);
    if (result.success) {
        await deductCredits(userId, 'premium_credits', 2.0, 'Cascade: PeopleDataLabs Success');
        return result;
    }

    const anyConfigured =
        (process.env.SKIP_TRACE_TWILIO_ACCOUNT_SID && process.env.SKIP_TRACE_TWILIO_AUTH_TOKEN) ||
        process.env.SKIP_TRACE_WHITEPAGES_API_KEY ||
        process.env.SKIP_TRACE_PDL_API_KEY;

    if (!anyConfigured) {
        throw new Error(
            'Skip trace unavailable: no providers configured. Set SKIP_TRACE_TWILIO_ACCOUNT_SID/AUTH_TOKEN, ' +
            'SKIP_TRACE_WHITEPAGES_API_KEY, or SKIP_TRACE_PDL_API_KEY.'
        );
    }
    throw new Error('All cascade providers failed to locate data for this address.');
}

// --- Live Providers ---

/**
 * Provider A — Twilio Lookup: validates/normalizes the phone on file for the
 * address's owner record and returns carrier intel. Cheapest tier.
 */
async function providerTwilioLookup(address: string): Promise<SkipTraceResult> {
    const sid = process.env.SKIP_TRACE_TWILIO_ACCOUNT_SID;
    const token = process.env.SKIP_TRACE_TWILIO_AUTH_TOKEN;
    if (!sid || !token) return { success: false, phones: [], emails: [], providerUsed: 'A (unconfigured)' };

    try {
        // Twilio Lookup is phone-oriented; resolve the owner phone from our
        // own records first via the address, then enrich it.
        const { query } = await import('./db.js');
        const res = await query('SELECT phone FROM leads WHERE address ILIKE $1 LIMIT 1', [`%${address}%`]);
        const phone = res.rows?.[0]?.phone;
        if (!phone) return { success: false, phones: [], emails: [], providerUsed: 'A (no phone on file)' };

        const resp = await fetch(
            `https://lookups.twilio.com/v2/PhoneNumbers/${encodeURIComponent(phone)}?Fields=line_type_intelligence`,
            {
                headers: { Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64') },
                signal: AbortSignal.timeout(15000),
            }
        );
        if (!resp.ok) return { success: false, phones: [], emails: [], providerUsed: 'A' };

        const data = await resp.json();
        return {
            success: true,
            phones: [data.phone_number || phone],
            emails: [],
            providerUsed: 'A (Twilio Lookup)',
        };
    } catch {
        return { success: false, phones: [], emails: [], providerUsed: 'A' };
    }
}

/**
 * Provider B — Whitepages Pro: person search by address, returns name,
 * phone(s), and email(s) when published.
 */
async function providerWhitepagesPro(address: string): Promise<SkipTraceResult> {
    const key = process.env.SKIP_TRACE_WHITEPAGES_API_KEY;
    if (!key) return { success: false, phones: [], emails: [], providerUsed: 'B (unconfigured)' };

    try {
        const params = new URLSearchParams({ address, api_key: key });
        const resp = await fetch(`https://proapi.whitepages.com/3.0/person?${params}`, {
            signal: AbortSignal.timeout(15000),
        });
        if (!resp.ok) return { success: false, phones: [], emails: [], providerUsed: 'B' };

        const data = await resp.json();
        const person = data?.results?.[0];
        if (!person) return { success: false, phones: [], emails: [], providerUsed: 'B' };

        return {
            success: true,
            phones: (person.phones || []).map((p: any) => p.phone_number).filter(Boolean),
            emails: (person.emails || []).map((e: any) => e.email).filter(Boolean),
            providerUsed: 'B (Whitepages Pro)',
        };
    } catch {
        return { success: false, phones: [], emails: [], providerUsed: 'B' };
    }
}

/**
 * Provider C — PeopleDataLabs: deep person enrichment (highest cost tier).
 */
async function providerPeopleDataLabs(address: string): Promise<SkipTraceResult> {
    const key = process.env.SKIP_TRACE_PDL_API_KEY;
    if (!key) return { success: false, phones: [], emails: [], providerUsed: 'C (unconfigured)' };

    try {
        const resp = await fetch('https://api.peopledataplabs.com/v5/person/enrich', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Api-Key': key },
            body: JSON.stringify({ location: { values: [address] } }),
            signal: AbortSignal.timeout(20000),
        });
        if (!resp.ok) return { success: false, phones: [], emails: [], providerUsed: 'C' };

        const data = await resp.json();
        const person = data?.data;
        if (!person) return { success: false, phones: [], emails: [], providerUsed: 'C' };

        return {
            success: true,
            phones: (person.phone_numbers || []).filter(Boolean),
            emails: (person.emails || []).map((e: any) => (typeof e === 'string' ? e : e.address)).filter(Boolean),
            providerUsed: 'C (PeopleDataLabs)',
        };
    } catch {
        return { success: false, phones: [], emails: [], providerUsed: 'C' };
    }
}
