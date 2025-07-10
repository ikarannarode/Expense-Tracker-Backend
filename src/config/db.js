import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables from .env file located one level up
config({ path: './.env' });

// Initialize Neon SQL client

export const sql = neon(process.env.DATABASE_URL);
