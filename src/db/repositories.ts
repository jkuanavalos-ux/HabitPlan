import { asc, eq, sql } from 'drizzle-orm';
import { getDatabase } from './client';
import * as schema from './schema';

/** Screens only depend on this local repository boundary. */
export const repositories = {
  habits: () => getDatabase().select().from(schema.habits).orderBy(asc(schema.habits.sortOrder)).all(),
  goals: () => getDatabase().select().from(schema.goals).orderBy(asc(schema.goals.priority)).all(),
  goal: (id: string) => getDatabase().select().from(schema.goals).where(eq(schema.goals.id, id)).get(),
  activities: (goalId: string) => getDatabase().select().from(schema.activities).where(eq(schema.activities.goalId, goalId)).orderBy(asc(schema.activities.sortOrder)).all(),
  schedule: () => getDatabase().select().from(schema.scheduleBlocks).orderBy(asc(schema.scheduleBlocks.sortOrder)).all(),
  summary: () => {
    const db = getDatabase();
    return {
      habits: db.select({ count: sql<number>`count(*)` }).from(schema.habits).get()!.count,
      goals: db.select({ count: sql<number>`count(*)` }).from(schema.goals).get()!.count,
      blocks: db.select({ count: sql<number>`count(*)` }).from(schema.scheduleBlocks).get()!.count,
    };
  },
};
