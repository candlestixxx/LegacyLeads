import { jest } from "@jest/globals";

// Setup Mock for credits BEFORE anything imports it
jest.unstable_mockModule("./credits.js", () => {
    return {
        deductCredits: jest.fn().mockResolvedValue(true as never)
    };
});

const { deductCredits } = await import("./credits.js");
const { cascadeSkipTrace } = await import("./skiptrace.js");

/**
 * Cascade contract tests (live providers):
 * - Provider A (Twilio Lookup) succeeds first -> 0.5 credits
 * - A fails -> B (Whitepages Pro) -> 1.0 credits
 * - A+B fail -> C (PeopleDataLabs) -> 2.0 credits
 * - Nothing configured -> configuration error, NO fabricated results
 *
 * Providers are exercised via env flags + mocked fetch; no network calls.
 */
describe('Smart Skip-Tracing Cascade Engine', () => {
    const originalEnv = { ...process.env };
    let fetchMock: jest.SpiedFunction<typeof global.fetch>;

    beforeEach(() => {
        (deductCredits as jest.Mock).mockClear();
        fetchMock = jest.spyOn(global, 'fetch') as any;
        fetchMock.mockReset();
    });

    afterEach(() => {
        process.env = { ...originalEnv };
        fetchMock.mockRestore();
    });

    it('throws a configuration error when no providers are configured (never fabricates)', async () => {
        delete process.env.SKIP_TRACE_TWILIO_ACCOUNT_SID;
        delete process.env.SKIP_TRACE_TWILIO_AUTH_TOKEN;
        delete process.env.SKIP_TRACE_WHITEPAGES_API_KEY;
        delete process.env.SKIP_TRACE_PDL_API_KEY;

        await expect(cascadeSkipTrace("user-123", "123 Main St")).rejects.toThrow(/no providers configured/i);
        expect(deductCredits).not.toHaveBeenCalled();
    });

    it('uses Whitepages Pro (Provider B) when configured and it matches -> 1.0 credits', async () => {
        delete process.env.SKIP_TRACE_TWILIO_ACCOUNT_SID;
        delete process.env.SKIP_TRACE_TWILIO_AUTH_TOKEN;
        process.env.SKIP_TRACE_WHITEPAGES_API_KEY = 'wp-test-key';
        delete process.env.SKIP_TRACE_PDL_API_KEY;

        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => ({ results: [{ name: { full_name: 'Jane Doe' }, phones: [{ phone_number: '+15551234567' }], emails: [{ email: 'jane@example.com' }] }] }),
        } as any);

        const result = await cascadeSkipTrace("user-123", "123 Main St");

        expect(result.success).toBe(true);
        expect(result.providerUsed).toContain('Whitepages');
        expect(result.phones).toEqual(['+15551234567']);
        expect(deductCredits).toHaveBeenCalledWith("user-123", "premium_credits", 1.0, expect.stringContaining('Whitepages'));
    });

    it('falls through to PeopleDataLabs (Provider C) -> 2.0 credits', async () => {
        delete process.env.SKIP_TRACE_TWILIO_ACCOUNT_SID;
        delete process.env.SKIP_TRACE_TWILIO_AUTH_TOKEN;
        process.env.SKIP_TRACE_WHITEPAGES_API_KEY = 'wp-test-key';
        process.env.SKIP_TRACE_PDL_API_KEY = 'pdl-test-key';

        fetchMock
            .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [] }) } as any) // B: no person
            .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { phone_numbers: ['+15559990000'], emails: [{ address: 'deep@example.com' }] } }) } as any); // C

        const result = await cascadeSkipTrace("user-123", "999 Unknown Ave");

        expect(result.success).toBe(true);
        expect(result.providerUsed).toContain('PeopleDataLabs');
        expect(deductCredits).toHaveBeenCalledWith("user-123", "premium_credits", 2.0, expect.stringContaining('PeopleDataLabs'));
    });

    it('reports failure when all configured providers miss — no fabricated contacts', async () => {
        delete process.env.SKIP_TRACE_TWILIO_ACCOUNT_SID;
        delete process.env.SKIP_TRACE_TWILIO_AUTH_TOKEN;
        process.env.SKIP_TRACE_WHITEPAGES_API_KEY = 'wp-test-key';
        delete process.env.SKIP_TRACE_PDL_API_KEY;

        fetchMock.mockResolvedValue({ ok: true, json: async () => ({ results: [] }) } as any);

        await expect(cascadeSkipTrace("user-123", "1 Nowhere Ln")).rejects.toThrow(/failed to locate/i);
        expect(deductCredits).not.toHaveBeenCalled();
    });
});
