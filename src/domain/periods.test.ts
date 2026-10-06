import { localDate, weekStart } from './periods';

describe('calendario local, lunes a domingo', () => {
  test('mantiene el día local cerca de medianoche', () => {
    expect(localDate(new Date(2026, 9, 6, 0, 1))).toBe('2026-10-06');
    expect(localDate(new Date(2026, 9, 6, 23, 59))).toBe('2026-10-06');
  });
  test.each([[6, '2026-10-05'], [11, '2026-10-05'], [12, '2026-10-12']])('día %s usa semana %s', (day, expected) => {
    expect(weekStart(new Date(2026, 9, day))).toBe(expected);
  });
  test('maneja cruce de año y febrero bisiesto', () => {
    expect(weekStart(new Date(2027, 0, 1))).toBe('2026-12-28');
    expect(localDate(new Date(2028, 1, 29))).toBe('2028-02-29');
  });
  test('rechaza fechas inválidas', () => expect(() => localDate(new Date(NaN))).toThrow('Fecha inválida'));
});
