import { DateTime } from 'luxon';

/**
 * ZIP prefix to US timezone mapping for TCPA quiet hours compliance.
 * Covers major metro areas; falls back to Eastern for unknown ZIPs.
 */
const ZIP_TIMEZONE_MAP: Record<string, string> = {
  '1': 'America/New_York',
  '2': 'America/New_York',
  '3': 'America/New_York',
  '4': 'America/New_York',
  '5': 'America/Chicago',
  '6': 'America/Chicago',
  '7': 'America/Chicago',
  '8': 'America/Denver',
  '9': 'America/Los_Angeles',
  '0': 'America/New_York',
};

const MAJOR_CITY_ZIPS: Record<string, string> = {
  '10': 'America/New_York',
  '11': 'America/New_York',
  '12': 'America/New_York',
  '19': 'America/New_York',
  '20': 'America/New_York',
  '30': 'America/New_York',
  '33': 'America/New_York',
  '48': 'America/Detroit',
  '60': 'America/Chicago',
  '63': 'America/Chicago',
  '77': 'America/Chicago',
  '80': 'America/Denver',
  '85': 'America/Phoenix',
  '90': 'America/Los_Angeles',
  '94': 'America/Los_Angeles',
  '98': 'America/Los_Angeles',
};

/**
 * Resolves a US ZIP code to its IANA timezone identifier.
 * Falls back to Eastern Time for unrecognized ZIPs.
 */
export function zipToTimezone(zipCode: string): string {
  if (!zipCode || zipCode.length < 1) return 'America/New_York';

  // Try 2-digit prefix first (more specific)
  const twoDigit = zipCode.substring(0, 2);
  if (MAJOR_CITY_ZIPS[twoDigit]) return MAJOR_CITY_ZIPS[twoDigit];

  // Fall back to 1-digit prefix
  const oneDigit = zipCode.substring(0, 1);
  return ZIP_TIMEZONE_MAP[oneDigit] || 'America/New_York';
}

/**
 * TCPA Quiet Hours Guardrail
 * Automatically blocks outbound synchronization and calling integrations outside
 * of the federally mandated local timezone hours (8 AM to 8 PM local time).
 *
 * @param propertyZipCode - The zip code of the lead.
 * @returns boolean - True if the current time is legally safe to call in that zip code.
 */
export function isWithinLegalCallHours(propertyZipCode: string): boolean {
  const targetTimezone = zipToTimezone(propertyZipCode);
  const localTime = DateTime.now().setZone(targetTimezone);

  // TCPA legal hours: >= 8 AM and < 8 PM (20:00) local time
  return localTime.hour >= 8 && localTime.hour < 20;
}

/**
 * CAN-SPAM compliance: Returns the local time in the lead's timezone
 * formatted for display in outreach scheduling UIs.
 */
export function getLocalTimeForZip(zipCode: string): string {
  const tz = zipToTimezone(zipCode);
  return DateTime.now().setZone(tz).toFormat('h:mm a ZZZZ');
}
