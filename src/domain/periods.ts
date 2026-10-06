/** Device-local calendar dates. Never uses UTC conversion for a calendar day. */
export function localDate(date: Date): string {
  if (Number.isNaN(date.getTime())) throw new Error('Fecha inválida');
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function weekStart(date: Date): string {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return localDate(monday);
}
