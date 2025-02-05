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

// export type TxnClient = zap.TxnClient<zap.IsolationSatisfying<zap.IsolationLevel.ReadCommitted>>;

// export function withTransaction<T>(
//     fn: (txn: TxnClient) => Promise<T>,
//     txn?: TxnClient
// ): Promise<T> {
//     if (txn) {
//         return fn(txn);
//     }
//     return zap.transaction(getPool(), zap.IsolationLevel.ReadCommitted, fn);
// }
