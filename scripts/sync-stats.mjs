/**
 * Reads the Anki 汉字 cards folder and writes data/anki-stats.json.
 * Run this before committing to update the dashboard with fresh Anki data:
 *   npm run sync-stats
 */

import { readdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const CARDS_DIR =
  "/Users/adam/Dokumenter/Documents/Claude projects/Anki flashcards/Anki 汉字/cards";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = join(__dirname, "../data/anki-stats.json");

const files = readdirSync(CARDS_DIR).filter((f) => f.endsWith(".json"));
const learnedCount = files.length;

const now = new Date();
const yearStart = new Date(now.getFullYear(), 0, 1);
const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
const dayOfYear = Math.floor((now - yearStart) / 86400000) + 1;
const daysInYear = Math.floor((yearEnd - yearStart) / 86400000);

const stats = {
  learnedCount,
  updatedAt: now.toISOString(),
  year: now.getFullYear(),
  dayOfYear,
  daysInYear,
};

writeFileSync(OUT_FILE, JSON.stringify(stats, null, 2));
console.log(`✓ Written ${OUT_FILE}`);
console.log(`  Cards learned: ${learnedCount}`);
