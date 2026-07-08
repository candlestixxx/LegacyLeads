import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// Unified connection configuration for the OmniLead Nexus Database
// Requires PostGIS extension enabled on the target database for geospatial mapping
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/omnilead',
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const getClient = () => pool.connect();

export default pool;