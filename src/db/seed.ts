import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { eq } from 'drizzle-orm';
import * as schema from './schema';
import { SEED_VERSION, seedUser, seedHabits, seedGoals, seedMilestones, seedActivities, seedChecklistItems, seedSchedule } from '../data/seed';
import quoteData from '../data/quotes.json';

/** Marker and rows commit together. Never re-seed edited/deleted rows on restart. */
export function loadSeed(db: ExpoSQLiteDatabase<typeof schema>) {
  db.transaction(tx => {
    if (tx.select().from(schema.appMeta).where(eq(schema.appMeta.key, 'seed_version')).get()) return;
    tx.insert(schema.users).values(seedUser).run();
    tx.insert(schema.habits).values(seedHabits).run();
    tx.insert(schema.goals).values(seedGoals).run();
    tx.insert(schema.milestones).values(seedMilestones).run();
    tx.insert(schema.activities).values(seedActivities).run();
    tx.insert(schema.checklistItems).values(seedChecklistItems).run();
    tx.insert(schema.scheduleBlocks).values(seedSchedule).run();
    tx.insert(schema.quotes).values(quoteData).run();
    tx.insert(schema.appMeta).values({ key: 'seed_version', value: SEED_VERSION }).run();
  });
}
