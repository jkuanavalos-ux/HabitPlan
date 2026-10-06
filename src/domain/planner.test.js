const D = require('./planner');
const fs = require('node:fs');
const vm = require('node:vm');
function seed() { const context = { window: {} }; vm.runInNewContext(fs.readFileSync('web/seed.js', 'utf8'), context); return JSON.parse(JSON.stringify(context.window.HabitSeed)); }

test('el seed es válido y conserva 9 hábitos, 5 objetivos y 14 bloques', () => {
  const state = D.validateState(seed());
  expect([state.habits.length, state.goals.length, state.schedule.length]).toEqual([9, 5, 14]);
  expect(state.goals.find(goal => goal.id === 'ganar-30m').dueDate).toBe('2027-03-01');
  expect(state.schedule.filter(block => block.suggested)).toHaveLength(3);
});
test('fecha local cerca de medianoche y fechas reales', () => {
  expect(D.localDate(new Date(2026, 9, 6, 23, 59))).toBe('2026-10-06');
  expect(D.validDate('2028-02-29')).toBe(true);
  expect(D.validDate('2026-02-29')).toBe(false);
  expect(D.validDate('2026-13-01')).toBe(false);
});
test('el progreso diario ignora sugeridos y no mezcla días', () => {
  const state = seed();
  const logs = { '2026-10-06': { meditar: true, agua: true } };
  expect(D.dailyProgress(state.habits, logs, '2026-10-06')).toEqual({ done: 1, total: 5, percent: 20 });
  expect(D.dailyProgress(state.habits, logs, '2026-10-07').done).toBe(0);
  expect(D.dailyProgress([], {}, '2026-10-06').percent).toBe(0);
});
test('dinero se calcula sobre cobrado, con límite 100 y resultado manual', () => {
  expect(D.goalProgress({ progress: 15000000, targetAmount: 30000000, done: false })).toBe(50);
  expect(D.goalProgress({ progress: 40000000, targetAmount: 30000000, done: false })).toBe(100);
  expect(D.goalProgress({ progress: 20, targetAmount: 0, done: false })).toBe(20);
  expect(D.goalProgress({ progress: 20, targetAmount: 0, done: true })).toBe(100);
});
test('bloque actual incluye inicio pero excluye fin, también en domingo', () => {
  const blocks = seed().schedule;
  expect(D.currentSchedule(blocks, new Date(2026, 9, 6, 10, 0)).current.title).toBe('Ventas y prospección');
  expect(D.currentSchedule(blocks, new Date(2026, 9, 6, 12, 0)).current.title).toBe('Libre / almuerzo');
  expect(D.currentSchedule(blocks, new Date(2026, 9, 11, 20, 0)).current.title).toBe('Guitarra');
  expect(D.currentSchedule(blocks, new Date(2026, 9, 6, 23, 0)).current).toBeUndefined();
  expect(D.plannedMinutes(blocks, 'mon')).toBe(17 * 60);
});
test('solapamiento se verifica solo en días compartidos, sin contar adyacentes', () => {
  const a = { id: 'a', days: ['mon'], start: '08:00', end: '10:00' };
  expect(D.hasOverlap({ id: 'b', days: ['mon'], start: '09:00', end: '11:00' }, [a])).toBe(true);
  expect(D.hasOverlap({ id: 'b', days: ['tue'], start: '09:00', end: '11:00' }, [a])).toBe(false);
  expect(D.hasOverlap({ id: 'b', days: ['mon'], start: '10:00', end: '11:00' }, [a])).toBe(false);
  expect(D.hasOverlap(a, [a])).toBe(false);
});
test.each(['ids', 'hora', 'fecha', 'progreso', 'dinero con decimales', 'logs', 'solapamiento'])('rechaza respaldo inválido: %s', kind => {
  const state = seed();
  if (kind === 'ids') state.habits.push(state.habits[0]);
  if (kind === 'hora') state.schedule[0].end = '99:00';
  if (kind === 'fecha') state.goals[0].dueDate = '2026-02-30';
  if (kind === 'progreso') state.goals[1].progress = -1;
  if (kind === 'dinero con decimales') state.goals[0].progress = 100.5;
  if (kind === 'logs') state.logs = { bad: { meditar: true } };
  if (kind === 'solapamiento') state.schedule[0].end = '10:00';
  expect(() => D.validateState(state)).toThrow();
});
test('un respaldo válido se clona sin mutar el origen', () => {
  const original = seed();
  const copy = D.validateState(original);
  copy.habits[0].name = 'Editado';
  expect(original.habits[0].name).toBe('Meditar');
});
