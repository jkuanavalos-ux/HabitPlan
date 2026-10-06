CREATE TABLE `Activity` (
	`id` text PRIMARY KEY NOT NULL,
	`goal_id` text NOT NULL,
	`title` text NOT NULL,
	`kind` text NOT NULL,
	`category` text NOT NULL,
	`weekly_target` integer,
	`days_of_week_json` text,
	`start_date` text,
	`end_date` text,
	`total_quantity` real,
	`unit` text,
	`group_label` text,
	`daily_minutes_target` integer,
	`sort_order` integer NOT NULL,
	`archived` integer DEFAULT false NOT NULL,
	`max_per_day` integer,
	`daily_target` real,
	`metadata_json` text DEFAULT '{}' NOT NULL,
	FOREIGN KEY (`goal_id`) REFERENCES `Goal`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `activity_goal` ON `Activity` (`goal_id`);--> statement-breakpoint
CREATE TABLE `ActivityLog` (
	`id` text PRIMARY KEY NOT NULL,
	`activity_id` text NOT NULL,
	`date` text NOT NULL,
	`value` real DEFAULT 0 NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	`minutes` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`activity_id`) REFERENCES `Activity`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `activity_log_activity` ON `ActivityLog` (`activity_id`);--> statement-breakpoint
CREATE INDEX `activity_log_date` ON `ActivityLog` (`date`);--> statement-breakpoint
CREATE TABLE `AppMeta` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ChecklistItem` (
	`id` text PRIMARY KEY NOT NULL,
	`activity_id` text NOT NULL,
	`title` text NOT NULL,
	`due_date` text,
	`group_label` text,
	`done` integer DEFAULT false NOT NULL,
	`done_at` text,
	FOREIGN KEY (`activity_id`) REFERENCES `Activity`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `checklist_activity` ON `ChecklistItem` (`activity_id`);--> statement-breakpoint
CREATE TABLE `Goal` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`priority` integer NOT NULL,
	`start_date` text NOT NULL,
	`due_date` text,
	`progress_mode` text NOT NULL,
	`target_amount` real,
	`unit` text,
	`status` text DEFAULT 'activo' NOT NULL,
	`manual_done` integer DEFAULT false NOT NULL,
	`completed_at` text,
	`notes` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `HabitLog` (
	`id` text PRIMARY KEY NOT NULL,
	`habit_id` text NOT NULL,
	`date` text NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	`minutes` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`habit_id`) REFERENCES `Habit`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `habit_log_day` ON `HabitLog` (`habit_id`,`date`);--> statement-breakpoint
CREATE INDEX `habit_log_date` ON `HabitLog` (`date`);--> statement-breakpoint
CREATE TABLE `Habit` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`emoji` text NOT NULL,
	`category` text NOT NULL,
	`tracking` text NOT NULL,
	`target_minutes` integer,
	`frequency_json` text NOT NULL,
	`color` text NOT NULL,
	`archived` integer DEFAULT false NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `JournalEntry` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`text` text NOT NULL,
	`mood` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `JournalEntry_date_unique` ON `JournalEntry` (`date`);--> statement-breakpoint
CREATE TABLE `Milestone` (
	`id` text PRIMARY KEY NOT NULL,
	`goal_id` text NOT NULL,
	`title` text NOT NULL,
	`due_date` text NOT NULL,
	`target_value` real,
	`target_value2` real,
	`status` text DEFAULT 'pendiente' NOT NULL,
	FOREIGN KEY (`goal_id`) REFERENCES `Goal`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `milestone_goal` ON `Milestone` (`goal_id`);--> statement-breakpoint
CREATE TABLE `Payment` (
	`id` text PRIMARY KEY NOT NULL,
	`sale_id` text NOT NULL,
	`amount` real NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`sale_id`) REFERENCES `Sale`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `payment_sale` ON `Payment` (`sale_id`);--> statement-breakpoint
CREATE INDEX `payment_date` ON `Payment` (`date`);--> statement-breakpoint
CREATE TABLE `Prospect` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`source` text NOT NULL,
	`status` text NOT NULL,
	`next_followup` text,
	`notes` text DEFAULT '' NOT NULL,
	`sale_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`sale_id`) REFERENCES `Sale`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Quote` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`author` text NOT NULL,
	`category` text NOT NULL,
	`essential` integer DEFAULT false NOT NULL,
	`favorite` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Sale` (
	`id` text PRIMARY KEY NOT NULL,
	`goal_id` text NOT NULL,
	`client` text NOT NULL,
	`description` text NOT NULL,
	`amount_agreed` real NOT NULL,
	`date` text NOT NULL,
	`status` text DEFAULT 'pendiente' NOT NULL,
	FOREIGN KEY (`goal_id`) REFERENCES `Goal`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `sale_goal` ON `Sale` (`goal_id`);--> statement-breakpoint
CREATE INDEX `sale_date` ON `Sale` (`date`);--> statement-breakpoint
CREATE TABLE `ScheduleBlock` (
	`id` text PRIMARY KEY NOT NULL,
	`days_json` text NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`title` text NOT NULL,
	`color` text NOT NULL,
	`category` text NOT NULL,
	`goal_id` text,
	`habit_id` text,
	`reminder_enabled` integer DEFAULT false NOT NULL,
	`sort_order` integer NOT NULL,
	`suggested` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`goal_id`) REFERENCES `Goal`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`habit_id`) REFERENCES `Habit`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `schedule_goal` ON `ScheduleBlock` (`goal_id`);--> statement-breakpoint
CREATE TABLE `StatusSnapshot` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`score` real NOT NULL,
	`level` integer NOT NULL,
	`breakdown_json` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `status_date` ON `StatusSnapshot` (`date`);--> statement-breakpoint
CREATE TABLE `TimeLog` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`minutes` integer NOT NULL,
	`category` text NOT NULL,
	`activity_id` text,
	`habit_id` text,
	`source` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`activity_id`) REFERENCES `Activity`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`habit_id`) REFERENCES `Habit`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `time_date` ON `TimeLog` (`date`);--> statement-breakpoint
CREATE INDEX `time_activity` ON `TimeLog` (`activity_id`);--> statement-breakpoint
CREATE TABLE `TrackedApp` (
	`package_name` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`category` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`avatar_uri` text,
	`language_studied` text DEFAULT '' NOT NULL,
	`settings_json` text NOT NULL,
	`onboarding_done` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `WeeklyReview` (
	`id` text PRIMARY KEY NOT NULL,
	`week_start` text NOT NULL,
	`summary_json` text NOT NULL,
	`reflection_text` text NOT NULL
);
