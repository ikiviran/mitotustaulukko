import pg from "pg";

import { env } from "./env.js";

let pool: pg.Pool | undefined;
export function getPool(): pg.Pool {
    if (pool) {
        return pool;
    }
    const config: pg.ClientConfig = {
        connectionString: env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    };
    pool = new pg.Pool(config);
    pool.on("error", (error) => {
        console.error("Pg pool error", error);
    });
    return pool;
}
