import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
    DATABASE_URL: getString("DATABASE_URL"),
    PORT: getIntOptional("PORT") ?? 3000,
};

function getString(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} is not set`);
    }
    return value;
}

function getIntOptional(key: string): number | undefined {
    const value = process.env[key];
    if (!value) {
        return undefined;
    }
    return parseInt(value);
}
