import { DateTime } from 'luxon';

/**
 * TCPA Quiet Hours Guardrail
 * Automatically blocks outbound synchronization and calling integrations outside
 * of the federally mandated local timezone hours (typically 8 AM to 8 PM).
 *
 * @param propertyZipCode - The zip code of the lead.
 * @returns boolean - True if the current time is legally safe to call in that zip code.
 */
export function isWithinLegalCallHours(propertyZipCode: string): boolean {
    // MOCK: In production, query a Zip-to-Timezone dictionary or Postgres table
    // For this mock we will assume Eastern Time (America/Detroit) for 48001
    let targetTimezone = 'America/Detroit';

    if (propertyZipCode === '90210') {
        targetTimezone = 'America/Los_Angeles';
    }

    const localTime = DateTime.now().setZone(targetTimezone);

    // Legal hours: >= 8 AM and < 8 PM (20:00) local time
    if (localTime.hour >= 8 && localTime.hour < 20) {
        return true;
    }

    return false;
}
