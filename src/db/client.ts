import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';
import { migrateDatabase } from './migrate';
import { loadSeed } from './seed';

export type Database = ReturnType<typeof createDatabase>;
function createDatabase() {
  const sqlite = openDatabaseSync('habitplan.db');
  try {
    sqlite.execSync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
    migrateDatabase(sqlite);
    const db = drizzle(sqlite, { schema });
    loadSeed(db);
    return db;
  } catch (error) {
    sqlite.closeSync();
    throw error;
  }
}
let instance: Database | undefined;
export function getDatabase(): Database {
  instance ??= createDatabase();
  return instance;
}
