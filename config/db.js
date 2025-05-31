import "dotenv/config";
import {neon} from "@neondatabase/serverless";

// Creates a SQL connection using our DB URL
export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions
        (
            id
            SERIAL
            PRIMARY
            KEY,
            user_id
            VARCHAR
                  (
            255
                  ) NOT NULL,
            title VARCHAR
                  (
                      255
                  ) NOT NULL,
            amount DECIMAL
                  (
                      10,
                      2
                  ) NOT NULL,
            category VARCHAR
                  (
                      255
                  ) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
            )`
        console.log('Database successfully created');
    } catch (error) {
        console.log(error);
        process.exit(1); // status code 1 means failure, 0 means success
    }
}
