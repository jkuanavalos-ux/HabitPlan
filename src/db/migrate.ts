import type { SQLiteDatabase } from 'expo-sqlite';
import { migrations } from './migrations/bundled';

export type MigrationDatabase = Pick<SQLiteDatabase, 'execSync' | 'getFirstSync' | 'withTransactionSync'>;
export function migrateDatabase(sqlite: MigrationDatabase) {
  const current = sqlite.getFirstSync<{ user_version: number }>('PRAGMA user_version')!.user_version;
  const latest = migrations[migrations.length - 1]?.version ?? 0;
  if (current > latest) throw new Error('La base de datos pertenece a una versión más nueva de HabitPlan.');
  for (const migration of migrations) {
    if (migration.version <= current) continue;
    sqlite.withTransactionSync(() => {
      sqlite.execSync(migration.sql);
      sqlite.execSync(`PRAGMA user_version = ${migration.version}`);
    });
  }
}
