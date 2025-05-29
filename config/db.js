import "dotenv/config";
import {neon} from "@neondatabase/serverless";

// Creates a SQL connection using our DB URL
export const sql = neon(process.env.DATABASE_URL);
