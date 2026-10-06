import type { InferInsertModel } from 'drizzle-orm';
import { activities, checklistItems, goals, habits, milestones, scheduleBlocks, users } from '../db/schema';

export const SEED_VERSION = 'v3-phase1';
export const SEED_DATE = '2026-10-06';
export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const weekdays = DAYS.slice(0, 5);
const mwf = ['mon', 'wed', 'fri'];
const guitar = ['tue', 'thu', 'sat', 'sun'];
export const seedUser: InferInsertModel<typeof users> = {
  id: 'local-user', name: '', languageStudied: '', onboardingDone: false, createdAt: SEED_DATE,
  settingsJson: JSON.stringify({ locale: 'es', currency: 'PYG', weekStartsOn: 1, distractionLimitMinutes: 120, exerciseDaysPerWeek: 3, studyMinutesPerDay: 180, workMinutesPerDay: 240, growthMinutesPerDay: 60 }),
};
export const seedHabits: InferInsertModel<typeof habits>[] = [
  ['meditar', 'Meditar', '🧘'], ['afirmaciones', 'Decir las afirmaciones (autosugestión)', '👄'],
  ['visualizar-dinero', 'Verse en posesión del dinero y realizando las actividades', '💰'],
  ['yo-ideal', 'Imaginarme a mi yo ideal', '🙋'], ['videos-desarrollo', 'Ver videos de desarrollo personal', '📺'],
  ['plan-dia', 'Plan del día (3 prioridades, 5 min)', '📝'], ['cierre-dia', 'Cierre del día en el diario (2 líneas: qué hice y qué aprendí)', '🌙'],
  ['agua', 'Tomar agua', '💧'], ['dormir', 'Dormir a hora fija', '😴'],
].map(([id, name, emoji], sortOrder) => ({ id: id!, name: name!, emoji: emoji!, category: sortOrder === 7 || sortOrder === 8 ? 'salud' : 'crecimiento', tracking: 'check', frequencyJson: JSON.stringify(DAYS), color: '#4F7CFF', enabled: sortOrder < 5, archived: false, sortOrder, createdAt: SEED_DATE }));

export const seedGoals: InferInsertModel<typeof goals>[] = [
  { id: 'ganar-30m', title: 'Ganar 30.000.000 Gs', category: 'trabajo', priority: 1, startDate: SEED_DATE, dueDate: '2027-03-01', progressMode: 'amount', targetAmount: 30000000, unit: 'Gs', notes: 'Vender sistemas y webs a medida a organizaciones y personas. Referencia: 3 landings ≈2.000.000 + 4 webs/catálogos con WhatsApp ≈3.500.000 + 1 sistema ≈10.000.000 (8 ventas). Precios orientativos, a validar con el mercado local. Mantenimiento mensual ≈150.000–300.000 Gs como extra. Cobro sugerido 50 % adelanto / 50 % entrega. Hasta el 20/nov: ~2 h/día a ventas+aprendizaje; desde el 21/nov: 3 h/día y más tiempo de entrega. Enero suele ser lento: adelantar prospección en diciembre. Primera venta ideal: 8/nov/2026.' },
  { id: 'novia', title: 'Conseguir novia', category: 'social', priority: 2, startDate: SEED_DATE, dueDate: '2026-10-25', progressMode: 'activities', notes: 'Se mide por acciones controlables; el resultado se marca manualmente. Conversar para conocer gente de verdad, respetar siempre un «no», no insistir ni presionar. Un rechazo cuenta como práctica cumplida. Cierre diario: ¿Qué hice hoy? ¿Qué aprendí? Domingo 25/oct: revisión del objetivo y planificación de las próximas semanas.' },
  { id: 'idiomas', title: 'Aprender idiomas', category: 'estudio', priority: 3, startDate: SEED_DATE, progressMode: 'activities', notes: 'La etiqueta usa el idioma elegido en el onboarding. Una de las 3 sesiones con práctica de hablar.' },
  { id: 'musica', title: 'Música: cantar y guitarra', category: 'musica', priority: 4, startDate: SEED_DATE, progressMode: 'activities', notes: 'Canción bien aprendida = letra, melodía y una grabación. Del 3 al 6/nov: repaso. Marcar un solo de la lista suma al contador semanal.' },
  { id: 'facultad', title: 'Pasar las materias de la facultad', category: 'estudio', priority: 2, startDate: SEED_DATE, dueDate: '2026-11-20', progressMode: 'activities', notes: 'Bloques de 50 min estudio + 10 min descanso; priorizar recordar activamente (preguntas y práctica) sobre releer.' },
];

export const seedMilestones: InferInsertModel<typeof milestones>[] = [
  ['oferta', 'Oferta definida (nicho, 3 paquetes, precios) + lista de 50 prospectos', '2026-10-13', null, null],
  ['demo', 'Demo 1 online + 10 contactos de red cálida', '2026-10-18', null, null],
  ['propuestas', '3 propuestas enviadas', '2026-10-31', null, null],
  ['venta-1', 'Primera venta (ideal: 8/nov)', '2026-11-15', 2000000, 1],
  ['venta-3', '3 ventas', '2026-12-15', 8000000, 3], ['venta-5', '5 ventas', '2027-01-15', 16000000, 5],
  ['venta-7', '7 ventas', '2027-02-10', 24000000, 7], ['venta-8', '8 ventas = meta', '2027-03-01', 30000000, 8],
].map(([id, title, dueDate, targetValue, targetValue2]) => ({ id: String(id), goalId: 'ganar-30m', title: String(title), dueDate: String(dueDate), targetValue: targetValue as number | null, targetValue2: targetValue2 as number | null, status: 'pendiente' }));

type Activity = InferInsertModel<typeof activities>;
export const seedActivities: Activity[] = [];
export const seedChecklistItems: InferInsertModel<typeof checklistItems>[] = [];
function activity(id: string, goalId: string, title: string, kind: string, extra: Partial<Activity> = {}) {
  const category = seedGoals.find(g => g.id === goalId)!.category;
  seedActivities.push({ id, goalId, title, kind, category, startDate: SEED_DATE, sortOrder: seedActivities.filter(a => a.goalId === goalId).length, ...extra });
}
function items(activityId: string, entries: (string | [string, string])[], groupLabel?: string, dueDate?: string) {
  entries.forEach((entry, i) => seedChecklistItems.push({ id: `${activityId}-${i + 1}`, activityId, title: typeof entry === 'string' ? entry : entry[0], dueDate: typeof entry === 'string' ? dueDate : entry[1], groupLabel }));
}
function counter(id: string, goalId: string, title: string, weeklyTarget: number, extra: Partial<Activity> = {}) {
  activity(id, goalId, title, 'weekly_counter', { weeklyTarget, daysOfWeekJson: JSON.stringify(DAYS), maxPerDay: 1, ...extra });
}
activity('desarrollo', 'ganar-30m', 'Desarrollo', 'daily_check', { dailyMinutesTarget: 120, daysOfWeekJson: JSON.stringify(DAYS) });
activity('ventas', 'ganar-30m', 'Ventas y prospección', 'daily_check', { dailyMinutesTarget: 60, daysOfWeekJson: JSON.stringify(weekdays), metadataJson: JSON.stringify({ maxMinutes: 120, learningMinutes: 30, help: 'Aprender + prospectar + seguimientos.' }) });
counter('contactos', 'ganar-30m', 'Contactos nuevos', 10, { startDate: '2026-10-12', maxPerDay: null });
counter('reuniones', 'ganar-30m', 'Reuniones o llamadas', 2, { startDate: '2026-10-26' });
counter('contenido', 'ganar-30m', 'Publicar contenido o caso de éxito', 2, { startDate: '2026-10-19' });
counter('seguimientos', 'ganar-30m', 'Seguimiento de prospectos', 5);
activity('portafolio', 'ganar-30m', 'Portafolio', 'checklist');
items('portafolio', [ ['Demo 1 landing para negocio local', '2026-10-18'], ['Demo 2 web con catálogo y botón de WhatsApp', '2026-11-01'], ['Demo 3 mini sistema (turnos/reservas o inventario)', '2026-11-15'], ['Perfil profesional y portafolio online', '2026-10-18'], ['Plantilla de propuesta y contrato simple', '2026-10-20'] ]);
activity('aprendizaje-ventas', 'ganar-30m', 'Aprendizaje de ventas y marketing', 'checklist');
items('aprendizaje-ventas', [ ['Curso de ventas consultivas (elegir uno)', '2026-10-31'], ['Meta Blueprint (cursos gratuitos de anuncios en Facebook/Instagram)', '2026-11-30'], ['Google Business Profile y SEO local básico', '2026-11-15'], ['Libro «The Psychology of Selling» (Brian Tracy)', '2026-11-30'], ['Cómo cotizar y negociar', '2026-11-15'] ]);
activity('ruta-tecnica', 'ganar-30m', 'Ruta técnica', 'checklist', { metadataJson: JSON.stringify({ grouping: 'week', userEditable: true }) });
items('ruta-tecnica', ['Desplegar un sitio', 'Integrar WhatsApp', 'Formulario → base de datos', 'Panel de administración', 'Pagos locales'], 'Semana 1');

// Each weekly action is a checklist group. Daily actions remain daily checks/counters.
const socialWeeks = [
  { label: 'Semana 1 · fácil', start: '2026-10-06', end: '2026-10-11', entries: [ ['Mini-charla de 1–2 minutos con alguien distinto (cajero, compañero, vecino)', 3], ['Aprender y usar el nombre de una persona del gym o la facu', 2] ] },
  { label: 'Semana 2 · medio', start: '2026-10-12', end: '2026-10-18', entries: [ ['Charla de 3–5 minutos con alguien nuevo', 4], ['Cumplido no físico (actitud, habilidad, ropa, constancia) a alguien distinto', 3], ['Pedir opinión o recomendación a un desconocido que genere charla', 3], ['Hablar con una chica en facu, gym o idiomas (conversación breve)', 2], ['Actividad social (clase grupal, jam, evento o reunión de música)', 1], ['Conectar por Instagram/WhatsApp con gente conocida del entorno', 2] ] },
  { label: 'Semana 3 · difícil', start: '2026-10-19', end: '2026-10-25', entries: [ ['Invitación a un plan (café, estudiar juntos, entrenar, escuchar música)', 3], ['Pedir contacto (Instagram/WhatsApp) tras una buena charla', 2], ['Charla de 10 minutos con una chica nueva', 2], ['Cita o salida con una chica (antes del 25/oct)', 1], ['Tocar o cantar en público o en una juntada (open mic)', 1], ['Hacer un pedido donde la respuesta puede ser «no» (manejo del rechazo)', 3] ] },
];
socialWeeks.forEach((week, i) => {
  const id = `social-s${i + 1}`;
  const entries = week.entries.flatMap(([title, count]) => Array.from({ length: Number(count) }, (_, n) => `${title} · ${n + 1}/${count}`));
  activity(id, 'novia', week.label, 'checklist', { startDate: week.start, endDate: week.end, groupLabel: week.label, totalQuantity: entries.length, metadataJson: JSON.stringify({ weeklyChecklistTarget: entries.length, dailyDaysTarget: i === 0 ? 6 : 7 }) });
  items(id, entries, week.label, week.end);
});
activity('saludos-gym', 'novia', 'Saludar a 2–4 personas del gym', 'daily_check', { endDate: '2026-10-18', dailyTarget: 2, maxPerDay: 4, daysOfWeekJson: JSON.stringify(DAYS), metadataJson: JSON.stringify({ valueControl: 'counter', min: 2, max: 4 }) });
activity('pregunta-desconocido', 'novia', 'Hacerle una pregunta a un desconocido (hora, dirección, recomendación)', 'daily_check', { endDate: '2026-10-11', daysOfWeekJson: JSON.stringify(DAYS) });
activity('sonrisa', 'novia', 'Dar las gracias o decir buen día con contacto visual y sonrisa a 3 personas', 'daily_check', { endDate: '2026-10-11', dailyTarget: 3, daysOfWeekJson: JSON.stringify(DAYS) });
activity('cierre-social', 'novia', 'Cierre diario: ¿Qué hice hoy? ¿Qué aprendí?', 'daily_check', { endDate: '2026-10-25', daysOfWeekJson: JSON.stringify(DAYS) });
activity('libro-social', 'novia', 'Libro de sociabilidad', 'quantity', { totalQuantity: 200, unit: 'páginas', endDate: '2026-10-20', metadataJson: JSON.stringify({ suggestedFinish: '2026-10-19', help: 'Al terminar cada capítulo, anotar una idea para aplicar hoy.' }) });
activity('videos-social', 'novia', 'Video sobre atracción/sociabilidad', 'scheduled_days', { daysOfWeekJson: JSON.stringify(mwf), endDate: '2026-10-25', totalQuantity: 8, unit: 'videos', metadataJson: JSON.stringify({ help: 'Después de cada video, anotar una acción para practicar ese mismo día.' }) });
counter('sesion-idiomas', 'idiomas', 'Sesión de idiomas', 3, { metadataJson: JSON.stringify({ useStudiedLanguage: true, help: 'Una de las 3 sesiones con práctica de hablar.' }) });
activity('canto', 'musica', 'Práctica de canto/vocalización', 'daily_check', { daysOfWeekJson: JSON.stringify(mwf) });
activity('guitarra', 'musica', 'Práctica de guitarra', 'daily_check', { daysOfWeekJson: JSON.stringify(guitar) });
activity('canciones', 'musica', '20 canciones bien aprendidas', 'checklist', { endDate: '2026-11-06', totalQuantity: 20, metadataJson: JSON.stringify({ userSuppliesTitles: true, groupTarget: 5, reviewStart: '2026-11-03', groups: [{ label: 'Semana 1', start: '2026-10-06', end: '2026-10-12' }, { label: 'Semana 2', start: '2026-10-13', end: '2026-10-19' }, { label: 'Semana 3', start: '2026-10-20', end: '2026-10-26' }, { label: 'Semana 4', start: '2026-10-27', end: '2026-11-02' }], help: 'Letra, melodía y una grabación.' }) });
activity('curso-guitarra', 'musica', 'Curso de guitarra', 'checklist', { metadataJson: JSON.stringify({ userSuppliesItems: true, grouping: 'week', editableWeeklyTarget: true }) });
counter('solos', 'musica', 'Solos de guitarra aprendidos', 2);
activity('lista-solos', 'musica', 'Lista de solos a aprender', 'checklist', { metadataJson: JSON.stringify({ userSuppliesItems: true, linkedCounterId: 'solos' }) });
counter('grabacion', 'musica', 'Grabarme cantando o tocando', 1);
activity('estudiar', 'facultad', 'Estudiar 3 h', 'daily_check', { dailyMinutesTarget: 180, daysOfWeekJson: JSON.stringify(DAYS), endDate: '2026-11-20' });
activity('materias', 'facultad', 'Materias y exámenes', 'checklist', { metadataJson: JSON.stringify({ userSuppliesItems: true, help: 'Cargar cada materia con su fecha de parcial/final.' }) });
counter('repaso', 'facultad', 'Repaso con práctica (exámenes anteriores o ejercicios)', 2, { endDate: '2026-11-20' });

type Block = InferInsertModel<typeof scheduleBlocks>;
const blocks: [string[], string, string, string, string, string, string | null, boolean?][] = [
  [weekdays, '06:00', '08:00', 'Meditar, leer, personal', '#00B0F0', 'crecimiento', null],
  [['sat', 'sun'], '06:00', '07:00', 'Libre', '#BFBFBF', 'descanso', null],
  [['sat', 'sun'], '07:00', '09:00', 'Meditar, leer, personal', '#00B0F0', 'crecimiento', null],
  [weekdays, '08:00', '10:00', 'Desarrollo', '#ED7D31', 'trabajo', 'ganar-30m'],
  [weekdays, '10:00', '12:00', 'Ventas y prospección', '#C55A11', 'trabajo', 'ganar-30m', true],
  [weekdays, '12:00', '13:00', 'Libre / almuerzo', '#3A3F5C', 'descanso', null, true],
  [['sat', 'sun'], '09:00', '11:00', 'Desarrollo', '#ED7D31', 'trabajo', 'ganar-30m'],
  [['sat', 'sun'], '11:00', '13:00', 'Libre', '#3A3F5C', 'descanso', null],
  [DAYS, '13:00', '16:00', 'Estudios facu', '#FFD966', 'estudio', 'facultad'],
  [['mon', 'wed', 'fri', 'sat', 'sun'], '16:00', '18:00', 'Idiomas', '#548235', 'estudio', 'idiomas'],
  [['tue', 'thu'], '16:00', '18:00', 'Social / networking (flex)', '#7A5BD6', 'social', 'novia', true],
  [DAYS, '18:00', '20:00', 'Ejercicios', '#212934', 'ejercicio', null],
  [mwf, '20:00', '23:00', 'Vocalización y cantar', '#2F5597', 'musica', 'musica'],
  [guitar, '20:00', '23:00', 'Guitarra', '#2F5597', 'musica', 'musica'],
];
export const seedSchedule: Block[] = blocks.map(([days, start, end, title, color, category, goalId, suggested], sortOrder) => ({ id: `schedule-${sortOrder + 1}`, daysJson: JSON.stringify(days), start, end, title, color, category, goalId, suggested: suggested ?? false, reminderEnabled: false, sortOrder }));
