import { Pool, type PoolConfig } from "pg";

const globalForDatabase = globalThis as unknown as {
    databasePool?: Pool;
};

function getDatabaseConfig(): PoolConfig | null {
    if (process.env.DATABASE_URL) {
        return {
            connectionString: process.env.DATABASE_URL,
            ssl:
                process.env.PGSSLMODE === "require"
                    ? { rejectUnauthorized: false }
                    : false,
        };
    }

    const { PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGSSLMODE, PGUSER } =
        process.env;

    if (!PGDATABASE || !PGHOST || !PGPASSWORD || !PGUSER) {
        return null;
    }

    return {
        database: PGDATABASE,
        host: PGHOST,
        password: PGPASSWORD,
        port: PGPORT ? Number(PGPORT) : 5432,
        ssl: PGSSLMODE === "require" ? { rejectUnauthorized: false } : false,
        user: PGUSER,
    };
}

export function isDatabaseConfigured() {
    return getDatabaseConfig() !== null;
}

export function getDatabasePool() {
    const config = getDatabaseConfig();

    if (!config) {
        throw new Error("PostgreSQL is not configured.");
    }

    if (!globalForDatabase.databasePool) {
        globalForDatabase.databasePool = new Pool(config);
    }

    return globalForDatabase.databasePool;
}
