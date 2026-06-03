import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "prisma/config";

// ─── Load .env for the Prisma CLI ───────────────────────────────────────
// Prisma CLI does not automatically load .env in all cases, so we parse it
// manually to ensure `npx prisma generate/db push/migrate` all work correctly.
try {
  const envFile = readFileSync(resolve(process.cwd(), ".env"), "utf-8");
  for (const rawLine of envFile.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIdx = line.indexOf("=");
    if (eqIdx === -1) continue;
    const key = line.slice(0, eqIdx).trim();
    const val = line.slice(eqIdx + 1).trim();
    // Don't overwrite vars that are already in the shell environment
    if (key && !(key in process.env)) process.env[key] = val;
  }
} catch {
  // .env not found — fall back to whatever is in the shell env
}

// Use DIRECT_URL for migrations when you use a pooled DATABASE_URL for the app (e.g. Neon).
const dbUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
// ─── Prisma configuration ──────────────────────────────────────────────────────
export default defineConfig({
  datasource: {
    // Use the UNPOOLED / direct URL for Prisma CLI commands (generate, db push,
    // migrate). The pooled pgbouncer URL breaks DDL statements during migrations.
    url: dbUrl,
  },
});
