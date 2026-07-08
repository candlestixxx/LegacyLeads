/**
 * Ingestion Abstraction Layer:
 * Defines the unified data schema mapped to the RESO (Real Estate Standards Organization) Web API.
 * All disparate MLS formats must be mapped into this standard JSON layout before DB insertion.
 */

export interface UnifiedPropertyRecord {
    ListingKey: string; // Globally Unique Identifier
    ListAgentMlsId?: string;
    ListingId: string;
    PropertyType: 'Residential' | 'Commercial' | 'Land' | 'Other';
    StandardStatus: 'Active' | 'Pending' | 'Closed' | 'Expired' | 'Canceled' | 'Withdrawn' | 'ComingSoon';

    // Geospatial Data (Mapped to PostGIS points)
    Latitude?: number;
    Longitude?: number;
    UnparsedAddress: string;
    City: string;
    StateOrProvince: string;
    PostalCode: string;

    // Pricing & Specs
    ListPrice: number;
    ClosePrice?: number;
    BedroomsTotal?: number;
    BathroomsTotalInteger?: number;
    LivingArea?: number;
    LotSizeAcres?: number;

    // Advanced Augmentation / Skip-Traced Data Layer
    OwnerName?: string;
    OwnerPhones?: string[]; // Cascade lookup arrays
    OwnerEmails?: string[];
    IsAbsenteeOwner?: boolean;
    EstimatedEquity?: number;

    ModificationTimestamp: Date; // Important for webhook diffing
}