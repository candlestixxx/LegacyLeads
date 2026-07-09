import app from './app.js';
import * as dotenv from 'dotenv';
import './db.js'; // Ensure DB pool initializes
import './redis.js'; // Ensure Redis client initializes

dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`OmniLead Nexus API Service Started on port ${PORT}`);
});