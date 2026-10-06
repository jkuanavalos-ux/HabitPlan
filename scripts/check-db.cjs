// Integration check: production migration + seed + Expo Drizzle adapter over real SQLite.
// Node 22.13+ supplies SQLite; no Android mocking of SQL or seed results.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
// Import driver directly: the barrel also exports Expo's native-only migrator.
const { drizzle } = require('drizzle-orm/expo-sqlite/driver');
const { getTableConfig } = require('drizzle-orm/sqlite-core');
const schema = require('../src/db/schema.ts');
const { migrateDatabase } = require('../src/db/migrate.ts');
const { loadSeed } = require('../src/db/seed.ts');
const { migrations } = require('../src/db/migrations/bundled.ts');

function open() {
  const native = new DatabaseSync(':memory:');
  native.exec('PRAGMA foreign_keys = ON');
  const sqlite = {
    execSync: sql => native.exec(sql),
    getFirstSync: sql => native.prepare(sql).get(),
    withTransactionSync: fn => {
      native.exec('BEGIN');
      try { fn(); native.exec('COMMIT'); } catch (error) { native.exec('ROLLBACK'); throw error; }
    },
    prepareSync: sql => {
      const statement = native.prepare(sql);
      return {
        executeSync: (params = []) => {
          if (/^\s*(select|pragma)/i.test(sql)) {
            const rows = statement.all(...params);
            return { getAllSync: () => rows, getFirstSync: () => rows[0] };
          }
          const result = statement.run(...params);
          return { changes: result.changes, lastInsertRowId: result.lastInsertRowid };
        },
        executeForRawResultSync: (params = []) => ({ getAllSync: () => statement.all(...params).map(row => Object.values(row)) }),
      };
    },
  };
  return { native, sqlite, db: drizzle(sqlite, { schema }) };
}
const { native, sqlite, db } = open();
migrateDatabase(sqlite);
migrateDatabase(sqlite);
assert.equal(native.prepare('PRAGMA user_version').get().user_version, migrations.length);
for (const table of Object.values(schema)) {
  const config = getTableConfig(table);
  const actual = native.prepare(`PRAGMA table_info("${config.name}")`).all().map(col => col.name).sort();
  assert.deepEqual(actual, config.columns.map(col => col.name).sort(), `Schema mismatch: ${config.name}`);
}
loadSeed(db);
loadSeed(db);
const count = table => native.prepare(`SELECT count(*) AS n FROM "${table}"`).get().n;
assert.equal(count('User'), 1);
assert.equal(count('Habit'), 9);
assert.equal(native.prepare('SELECT count(*) AS n FROM Habit WHERE enabled = 1').get().n, 5);
assert.equal(count('Goal'), 5);
assert.equal(count('Milestone'), 8);
assert.equal(count('ScheduleBlock'), 14);
assert.equal(count('Quote'), 10);
assert.equal(native.prepare('SELECT count(*) AS n FROM ScheduleBlock WHERE suggested = 1').get().n, 3);
// Compare persisted blocks directly to the source SPEC, not to a second copy of the seed.
const spec = fs.readFileSync(require('node:path').join(__dirname, '../HABITPLAN_SPEC_v3.md'), 'utf8');
const scheduleJson = spec.split('### 15.5')[1].match(/```json\s*([\s\S]*?)```/)[1];
const expectedBlocks = JSON.parse(scheduleJson);
const persistedBlocks = native.prepare('SELECT * FROM ScheduleBlock ORDER BY sort_order').all();
expectedBlocks.forEach((block, i) => {
  const row = persistedBlocks[i];
  assert.deepEqual(JSON.parse(row.days_json), block.days);
  for (const key of ['start', 'end', 'title', 'color', 'category']) assert.equal(row[key], block[key]);
  assert.equal(row.goal_id, block.goal ?? null);
  assert.equal(Boolean(row.suggested), block.suggested ?? false);
});
assert.equal(native.prepare("SELECT due_date FROM Goal WHERE id = 'ganar-30m'").get().due_date, '2027-03-01');
assert.equal(native.prepare("SELECT due_date FROM Goal WHERE id = 'novia'").get().due_date, '2026-10-25');
assert.equal(native.prepare("SELECT count(*) AS n FROM Goal WHERE due_date IS NULL").get().n, 2);
assert.equal(native.prepare("SELECT max_per_day FROM Activity WHERE id = 'contactos'").get().max_per_day, null);
assert.equal(native.prepare("SELECT max_per_day FROM Activity WHERE id = 'sesion-idiomas'").get().max_per_day, 1);
assert.equal(native.prepare("SELECT total_quantity FROM Activity WHERE id = 'libro-social'").get().total_quantity, 200);
assert.equal(native.prepare("SELECT count(*) AS n FROM ChecklistItem WHERE activity_id = 'social-s1'").get().n, 5);
assert.equal(native.prepare("SELECT count(*) AS n FROM ChecklistItem WHERE activity_id = 'social-s2'").get().n, 15);
assert.equal(native.prepare("SELECT count(*) AS n FROM ChecklistItem WHERE activity_id = 'social-s3'").get().n, 12);
assert.equal(native.prepare("SELECT count(*) AS n FROM ChecklistItem WHERE activity_id = 'canciones'").get().n, 0);
const songs = JSON.parse(native.prepare("SELECT metadata_json FROM Activity WHERE id = 'canciones'").get().metadata_json);
assert.equal(songs.groups.length, 4);
assert.equal(songs.groupTarget, 5);
const video = native.prepare("SELECT * FROM Activity WHERE id = 'videos-social'").get();
let videoCount = 0;
const dayCodes = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
for (let day = 6; day <= 25; day++) if (JSON.parse(video.days_of_week_json).includes(dayCodes[new Date(2026, 9, day).getDay()])) videoCount++;
assert.equal(videoCount, 8);
assert.deepEqual(native.prepare('PRAGMA foreign_key_check').all(), []);
for (const table of ['HabitLog', 'ActivityLog', 'Sale', 'Payment', 'Prospect', 'TimeLog', 'JournalEntry', 'StatusSnapshot', 'WeeklyReview']) assert.equal(count(table), 0);
// Restart never overwrites edits or resurrects deleted seed rows.
native.exec("UPDATE Habit SET name = 'Editado' WHERE id = 'meditar'; DELETE FROM Habit WHERE id = 'agua';");
loadSeed(db);
assert.equal(native.prepare("SELECT name FROM Habit WHERE id = 'meditar'").get().name, 'Editado');
assert.equal(count('Habit'), 8);
native.exec("INSERT INTO HabitLog (id,habit_id,date,done,minutes) VALUES ('log1','meditar','2026-10-06',1,0)");
assert.throws(() => native.exec("INSERT INTO HabitLog (id,habit_id,date,done,minutes) VALUES ('log2','meditar','2026-10-06',0,0)"), /UNIQUE/);
assert.throws(() => native.exec("INSERT INTO ActivityLog (id,activity_id,date,value,done,minutes) VALUES ('bad','missing','2026-10-06',1,1,0)"), /FOREIGN KEY/);
// Failure halfway through a seed rolls back rows and marker, then retry succeeds.
const failure = open();
migrateDatabase(failure.sqlite);
failure.native.exec("CREATE TRIGGER reject_seed BEFORE INSERT ON Goal BEGIN SELECT RAISE(ABORT, 'seed test failure'); END");
assert.throws(() => loadSeed(failure.db));
assert.equal(failure.native.prepare('SELECT count(*) AS n FROM Habit').get().n, 0);
assert.equal(failure.native.prepare('SELECT count(*) AS n FROM AppMeta').get().n, 0);
failure.native.exec('DROP TRIGGER reject_seed');
loadSeed(failure.db);
assert.equal(failure.native.prepare('SELECT count(*) AS n FROM Goal').get().n, 5);
// A failed migration cannot leave half a schema behind.
const migrationFailure = open();
const execute = migrationFailure.sqlite.execSync;
migrationFailure.sqlite.execSync = sql => { execute(sql); if (sql === migrations[0].sql) throw new Error('migration test failure'); };
assert.throws(() => migrateDatabase(migrationFailure.sqlite), /migration test failure/);
assert.equal(migrationFailure.native.prepare('PRAGMA user_version').get().user_version, 0);
assert.equal(migrationFailure.native.prepare("SELECT count(*) AS n FROM sqlite_master WHERE type = 'table'").get().n, 0);
native.exec('PRAGMA user_version = 999');
assert.throws(() => migrateDatabase(sqlite), /más nueva/);
native.close(); failure.native.close(); migrationFailure.native.close();
console.log('SQLite OK: 19 tablas, migraciones atómicas, seed completo e idempotente, edición persistente, relaciones y restricciones.');
