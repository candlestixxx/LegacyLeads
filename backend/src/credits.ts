import { getClient } from './db.js';

/**
 * Deducts credits from a user's ledger transactionally.
 * @param userId - The UUID of the user.
 * @param creditType - 'basic_credits' or 'premium_credits'.
 * @param amount - The number of credits to deduct.
 * @param description - Reason for deduction.
 * @returns boolean - True if successful, throws error if insufficient funds.
 */
export async function deductCredits(
    userId: string,
    creditType: 'basic_credits' | 'premium_credits',
    amount: number,
    description: string
): Promise<boolean> {
    const client = await getClient();
    try {
        await client.query('BEGIN'); // Start atomic transaction

        // 1. Lock the row to prevent race conditions from concurrent webhook/API requests
        const ledgerQuery = `SELECT ${creditType} FROM credit_ledgers WHERE user_id = $1 FOR UPDATE`;
        const ledgerResult = await client.query(ledgerQuery, [userId]);

        if (ledgerResult.rows.length === 0) {
            throw new Error(`User ledger not found for ID: ${userId}`);
        }

        const currentBalance = ledgerResult.rows[0][creditType];

        // 2. Strict atomic check preventing ledger overruns
        if (currentBalance < amount) {
            throw new Error(`Insufficient ${creditType}. Required: ${amount}, Available: ${currentBalance}`);
        }

        // 3. Deduct the credits
        const updateQuery = `UPDATE credit_ledgers SET ${creditType} = ${creditType} - $1, updated_at = NOW() WHERE user_id = $2`;
        await client.query(updateQuery, [amount, userId]);

        // 4. Log the transaction
        const auditQuery = `INSERT INTO credit_transactions (user_id, credit_type, amount, description) VALUES ($1, $2, $3, $4)`;
        await client.query(auditQuery, [userId, creditType, -amount, description]);

        await client.query('COMMIT');
        return true;
    } catch (e) {
        await client.query('ROLLBACK');
        console.error(`Credit Deduction Failed for user ${userId}:`, e);
        throw e;
    } finally {
        client.release();
    }
}
