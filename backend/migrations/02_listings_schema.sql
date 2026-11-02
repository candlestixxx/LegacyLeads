-- 02_listings_schema.sql — listings table backing GET /listings + POST /augmentpropertyrecord
--
-- Why this file exists: migration 01 created `properties`, but the API
-- queries a `listings` table with quoted RESO-style identifiers
-- ("StandardStatus", "ListPrice", "PostalCode") plus a geography column
-- for radius search. Without this table /listings returns 500.
-- New tables start EMPTY — rows arrive via the MLS ingestion gateway
-- (not built yet), so /listings returns {data: [], count: 0} until then.

-- Requires PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS listings (
    "ListingKey" VARCHAR(255) PRIMARY KEY,
    "ListAgentMlsId" VARCHAR(255),
    "ListingId" VARCHAR(255) NOT NULL,
    "PropertyType" VARCHAR(50),
    "StandardStatus" VARCHAR(50),
    "UnparsedAddress" TEXT,
    "City" VARCHAR(100),
    "StateOrProvince" VARCHAR(100),
    "PostalCode" VARCHAR(20),
    "ListPrice" DECIMAL(12, 2),
    "ClosePrice" DECIMAL(12, 2),
    "BedroomsTotal" INT,
    "BathroomsTotalInteger" INT,
    "LivingArea" INT,
    "LotSizeAcres" DECIMAL(10, 4),
    "OwnerName" VARCHAR(255),
    "ModificationTimestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    geom GEOMETRY(Point, 4326)
);

CREATE INDEX IF NOT EXISTS idx_listings_status ON listings ("StandardStatus");
CREATE INDEX IF NOT EXISTS idx_listings_postal ON listings ("PostalCode");
CREATE INDEX IF NOT EXISTS idx_listings_geom ON listings USING GIST (geom);
