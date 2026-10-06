import { sqliteTable, text, integer, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core';

const id = () => text('id').primaryKey();
const flag = (name: string, value = false) => integer(name, { mode: 'boolean' }).notNull().default(value);
export const users = sqliteTable('User', {
  id: id(), name: text('name').notNull(), avatarUri: text('avatar_uri'), languageStudied: text('language_studied').notNull().default(''),
  settingsJson: text('settings_json').notNull(), onboardingDone: flag('onboarding_done'), createdAt: text('created_at').notNull(),
});
export const habits = sqliteTable('Habit', {
  id: id(), name: text('name').notNull(), emoji: text('emoji').notNull(), category: text('category').notNull(), tracking: text('tracking', { enum: ['check', 'time'] }).notNull(),
  targetMinutes: integer('target_minutes'), frequencyJson: text('frequency_json').notNull(), color: text('color').notNull(), archived: flag('archived'), enabled: flag('enabled', true), sortOrder: integer('sort_order').notNull(), createdAt: text('created_at').notNull(),
});
export const habitLogs = sqliteTable('HabitLog', {
  id: id(), habitId: text('habit_id').notNull().references(() => habits.id, { onDelete: 'cascade' }), date: text('date').notNull(), done: flag('done'), minutes: integer('minutes').notNull().default(0),
}, t => [uniqueIndex('habit_log_day').on(t.habitId, t.date), index('habit_log_date').on(t.date)]);
export const goals = sqliteTable('Goal', {
  id: id(), title: text('title').notNull(), category: text('category').notNull(), priority: integer('priority').notNull(), startDate: text('start_date').notNull(), dueDate: text('due_date'), progressMode: text('progress_mode').notNull(), targetAmount: real('target_amount'), unit: text('unit'), status: text('status').notNull().default('activo'), manualDone: flag('manual_done'), completedAt: text('completed_at'), notes: text('notes').notNull().default(''),
});
export const milestones = sqliteTable('Milestone', {
  id: id(), goalId: text('goal_id').notNull().references(() => goals.id, { onDelete: 'cascade' }), title: text('title').notNull(), dueDate: text('due_date').notNull(), targetValue: real('target_value'), targetValue2: real('target_value2'), status: text('status').notNull().default('pendiente'),
}, t => [index('milestone_goal').on(t.goalId)]);
export const activities = sqliteTable('Activity', {
  id: id(), goalId: text('goal_id').notNull().references(() => goals.id, { onDelete: 'cascade' }), title: text('title').notNull(), kind: text('kind').notNull(), category: text('category').notNull(), weeklyTarget: integer('weekly_target'), daysOfWeekJson: text('days_of_week_json'), startDate: text('start_date'), endDate: text('end_date'), totalQuantity: real('total_quantity'), unit: text('unit'), groupLabel: text('group_label'), dailyMinutesTarget: integer('daily_minutes_target'), sortOrder: integer('sort_order').notNull(), archived: flag('archived'),
  // Explicit extensions needed by seed 15: per-day limits and grouped checklist targets.
  maxPerDay: integer('max_per_day'), dailyTarget: real('daily_target'), metadataJson: text('metadata_json').notNull().default('{}'),
}, t => [index('activity_goal').on(t.goalId)]);
export const checklistItems = sqliteTable('ChecklistItem', {
  id: id(), activityId: text('activity_id').notNull().references(() => activities.id, { onDelete: 'cascade' }), title: text('title').notNull(), dueDate: text('due_date'), groupLabel: text('group_label'), done: flag('done'), doneAt: text('done_at'),
}, t => [index('checklist_activity').on(t.activityId)]);
export const activityLogs = sqliteTable('ActivityLog', {
  id: id(), activityId: text('activity_id').notNull().references(() => activities.id, { onDelete: 'cascade' }), date: text('date').notNull(), value: real('value').notNull().default(0), done: flag('done'), minutes: integer('minutes').notNull().default(0),
}, t => [index('activity_log_activity').on(t.activityId), index('activity_log_date').on(t.date)]);
export const sales = sqliteTable('Sale', {
  id: id(), goalId: text('goal_id').notNull().references(() => goals.id), client: text('client').notNull(), description: text('description').notNull(), amountAgreed: real('amount_agreed').notNull(), date: text('date').notNull(), status: text('status').notNull().default('pendiente'),
}, t => [index('sale_goal').on(t.goalId), index('sale_date').on(t.date)]);
export const payments = sqliteTable('Payment', {
  id: id(), saleId: text('sale_id').notNull().references(() => sales.id, { onDelete: 'cascade' }), amount: real('amount').notNull(), date: text('date').notNull(),
}, t => [index('payment_sale').on(t.saleId), index('payment_date').on(t.date)]);
export const prospects = sqliteTable('Prospect', {
  id: id(), name: text('name').notNull(), contact: text('contact').notNull(), source: text('source').notNull(), status: text('status').notNull(), nextFollowup: text('next_followup'), notes: text('notes').notNull().default(''), saleId: text('sale_id').references(() => sales.id), createdAt: text('created_at').notNull(), updatedAt: text('updated_at').notNull(),
});
export const scheduleBlocks = sqliteTable('ScheduleBlock', {
  id: id(), daysJson: text('days_json').notNull(), start: text('start').notNull(), end: text('end').notNull(), title: text('title').notNull(), color: text('color').notNull(), category: text('category').notNull(), goalId: text('goal_id').references(() => goals.id, { onDelete: 'set null' }), habitId: text('habit_id').references(() => habits.id, { onDelete: 'set null' }), reminderEnabled: flag('reminder_enabled'), sortOrder: integer('sort_order').notNull(), suggested: flag('suggested'),
}, t => [index('schedule_goal').on(t.goalId)]);
export const timeLogs = sqliteTable('TimeLog', {
  id: id(), date: text('date').notNull(), minutes: integer('minutes').notNull(), category: text('category').notNull(), activityId: text('activity_id').references(() => activities.id, { onDelete: 'set null' }), habitId: text('habit_id').references(() => habits.id, { onDelete: 'set null' }), source: text('source', { enum: ['system', 'timer', 'manual'] }).notNull(), note: text('note').notNull().default(''),
}, t => [index('time_date').on(t.date), index('time_activity').on(t.activityId)]);
export const trackedApps = sqliteTable('TrackedApp', { packageName: text('package_name').primaryKey(), label: text('label').notNull(), category: text('category', { enum: ['redes', 'ocio'] }).notNull() });
export const journalEntries = sqliteTable('JournalEntry', {
  id: id(), date: text('date').notNull().unique(), text: text('text').notNull(), mood: integer('mood'), createdAt: text('created_at').notNull(), updatedAt: text('updated_at').notNull(),
});
export const quotes = sqliteTable('Quote', { id: id(), text: text('text').notNull(), author: text('author').notNull(), category: text('category').notNull(), essential: flag('essential'), favorite: flag('favorite') });
export const statusSnapshots = sqliteTable('StatusSnapshot', { id: id(), date: text('date').notNull(), score: real('score').notNull(), level: integer('level').notNull(), breakdownJson: text('breakdown_json').notNull() }, t => [index('status_date').on(t.date)]);
export const weeklyReviews = sqliteTable('WeeklyReview', { id: id(), weekStart: text('week_start').notNull(), summaryJson: text('summary_json').notNull(), reflectionText: text('reflection_text').notNull() });
export const appMeta = sqliteTable('AppMeta', { key: text('key').primaryKey(), value: text('value').notNull() });
