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
 * @param userId - Requesting User
 * @param address - Unparsed address to skip trace
 */
export async function cascadeSkipTrace(userId: string, address: string): Promise<SkipTraceResult> {
    // 1. Attempt Primary Provider (Lowest Cost: 0.5 Credits)
    let result = await mockProviderA(address);
    if (result.success) {
        await deductCredits(userId, 'premium_credits', 0.5, 'Cascade: Provider A Success');
        return result;
    }

    // 2. Fallback to Premium Provider B (Mid Cost: 1.0 Credits)
    result = await mockProviderB(address);
    if (result.success) {
        await deductCredits(userId, 'premium_credits', 1.0, 'Cascade: Provider B Success');
        return result;
    }

    // 3. Fallback to Deep Search Provider C (High Cost: 2.0 Credits)
    result = await mockProviderC(address);
    if (result.success) {
        await deductCredits(userId, 'premium_credits', 2.0, 'Cascade: Provider C Success');
        return result;
    }

    throw new Error('All cascade providers failed to locate data for this address.');
}


// --- Mock Providers ---

async function mockProviderA(address: string): Promise<SkipTraceResult> {
    // Fails on certain addresses
    if (address.includes('Pineview')) {
        return { success: false, phones: [], emails: [], providerUsed: 'A' };
    }
    return { success: true, phones: ['555-1000'], emails: ['a@example.com'], providerUsed: 'A' };
}

async function mockProviderB(address: string): Promise<SkipTraceResult> {
    // Fails on completely invalid addresses
    if (address.includes('Nowhere')) {
        return { success: false, phones: [], emails: [], providerUsed: 'B' };
    }
    return { success: true, phones: ['555-2000'], emails: ['b@example.com'], providerUsed: 'B' };
}

async function mockProviderC(address: string): Promise<SkipTraceResult> {
    return { success: true, phones: ['555-3000', '555-3001'], emails: ['c@deepsearch.com'], providerUsed: 'C' };
}