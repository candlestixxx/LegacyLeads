import { jest } from "@jest/globals";

// Setup Mock for credits BEFORE anything imports it
jest.unstable_mockModule("./credits.js", () => {
    return {
        deductCredits: jest.fn().mockResolvedValue(true as never)
    };
});

const { deductCredits } = await import("./credits.js");
const { cascadeSkipTrace } = await import("./skiptrace.js");

describe('Smart Skip-Tracing Cascade Engine', () => {

    beforeEach(() => {
        (deductCredits as jest.Mock).mockClear();
    });

    it('should successfully use Provider A for a normal address and charge 0.5 credits', async () => {
        const result = await cascadeSkipTrace("user-123", "123 Main St");

        expect(result.success).toBe(true);
        expect(result.providerUsed).toBe('A');
        expect(deductCredits).toHaveBeenCalledWith("user-123", "premium_credits", 0.5, "Cascade: Provider A Success");
    });

    it('should fall back to Provider B for a Pineview address and charge 1.0 credits', async () => {
        const result = await cascadeSkipTrace("user-123", "8910 Pineview Dr");

        expect(result.success).toBe(true);
        expect(result.providerUsed).toBe('B');
        expect(deductCredits).toHaveBeenCalledWith("user-123", "premium_credits", 1.0, "Cascade: Provider B Success");
    });

    it('should fall back to Provider C for a Nowhere Pineview address and charge 2.0 credits', async () => {
        const result = await cascadeSkipTrace("user-123", "8910 Pineview Nowhere Dr");

        expect(result.success).toBe(true);
        expect(result.providerUsed).toBe('C');
        expect(deductCredits).toHaveBeenCalledWith("user-123", "premium_credits", 2.0, "Cascade: Provider C Success");
    });

});