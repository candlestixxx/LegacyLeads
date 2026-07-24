-- Requires PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Property Data Normalized to RESO standard
CREATE TABLE IF NOT EXISTS properties (
    listing_key VARCHAR(255) PRIMARY KEY,
    list_agent_mls_id VARCHAR(255),
    listing_id VARCHAR(255) NOT NULL,
    property_type VARCHAR(50),
    standard_status VARCHAR(50),
    unparsed_address TEXT,
    city VARCHAR(100),
    state_or_province VARCHAR(100),
    postal_code VARCHAR(20),
    list_price DECIMAL(12, 2),
    close_price DECIMAL(12, 2),
    bedrooms_total INT,
    bathrooms_total_integer INT,
    living_area INT,
    lot_size_acres DECIMAL(10, 4),
    owner_name VARCHAR(255),
    is_absentee_owner BOOLEAN DEFAULT FALSE,
    estimated_equity DECIMAL(12, 2),
    modification_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    geom GEOMETRY(Point, 4326) -- PostGIS Spatial Column
);

-- 2. User Credit Ledgers (Atomic Transaction Structure)
CREATE TABLE IF NOT EXISTS credit_ledgers (
    user_id UUID PRIMARY KEY,
    basic_credits DECIMAL(10, 2) DEFAULT 0,
    premium_credits DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Deduction Audit Log
CREATE TABLE IF NOT EXISTS credit_transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES credit_ledgers(user_id),
    credit_type VARCHAR(50), -- 'basic' or 'premium'
    amount DECIMAL(10, 2) NOT NULL,     -- negative for deduction, positive for top-up
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
