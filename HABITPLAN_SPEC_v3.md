# HabitPlan — Especificación completa para Codex (v3)

> **Instrucciones para Codex**
> - Construí esta app siguiendo el documento, **por fases** (sección 17). Al cerrar cada fase la app debe compilar y funcionar.
> - La **sección 15 (datos semilla)** contiene los objetivos, actividades, hábitos y horario reales del usuario. Cargalos como datos iniciales **editables** (el usuario puede borrarlos o cambiarlos).
> - El usuario adjunta una **imagen del horario semanal**. La sección 5.4 y el seed 15.5 la reproducen; usá la imagen como referencia visual de colores y bloques.
> - Si algo es ambiguo, elegí la opción más simple y anotala en `DECISIONS.md`.
> - El nombre va en una constante (`APP_NAME = "HabitPlan"`) para poder cambiarlo.
> - Hoy es 6/oct/2026. Todas las fechas del seed son reales; no las muevas.

---

## 1. Visión

App móvil de hábitos, objetivos, tiempo y horario. Responde a **"¿Estoy por buen camino?"**: mide si las acciones sostenidas acercan al usuario a sus objetivos y si hay equilibrio entre trabajo/estudio/crecimiento, ejercicio y distracciones (redes y "joda").

Principios: constancia sobre perfección · honestidad (el Estado dice la verdad) · pocos objetivos con fecha · chequear = 1 toque · el resultado final de un objetivo puede depender de otros, así que **la app mide sobre todo las acciones que el usuario controla**.

## 2. Plataforma y stack

- **Android primero**, código preparado para iOS (iOS fuera de v1).
- **React Native + Expo (TypeScript)** con **development build** (no Expo Go) por el módulo nativo de uso de apps. Expo Router.
- **SQLite local** (`expo-sqlite`) + Drizzle ORM. 100 % offline, **sin cuenta ni servidor en v1**.
- Zustand, `date-fns`, `react-native-svg` o `victory-native`, `expo-notifications`, haptics.
- Español (preparado para `i18next`). **Tema único oscuro azul medianoche** (sección 13).
- Moneda: **Guaraníes (Gs)**, formato `30.000.000`, sin decimales. Semana: **lunes a domingo**. Zona horaria: del dispositivo.

## 3. Conceptos del dominio

### 3.1 Hábitos diarios (solo check)
Cosas que se hacen todos los días, **sin objetivo asociado**. Se chequean en el Home. (Seed en 15.1.)

### 3.2 Objetivos
Un objetivo tiene: nombre, prioridad (orden), fecha límite **opcional** (sin fecha = objetivo continuo), estado (`activo`, `completado`, `pausado`, `vencido`), **modo de progreso** (3.4), **actividades** y **hitos**.

> **Los checks de las actividades de un objetivo se hacen dentro del objetivo** (pantalla de detalle). En el Home solo aparece un resumen: "Hoy en tus objetivos: 4 pendientes" y cada línea lleva al objetivo.

### 3.3 Actividades (dentro de un objetivo) — tipos de seguimiento
| Tipo | Qué es | Ejemplo |
|---|---|---|
| `daily_check` | Check por día (con minutos opcionales) | Facultad 3 h |
| `weekly_counter` | Botón **+1** por sesión; la semana se completa al llegar a la meta | Idiomas 3/semana |
| `scheduled_days` | Check en días fijos de la semana, dentro de un rango de fechas | Video los lun/mié/vie |
| `checklist` | Lista de ítems con check (cada uno con fecha o semana opcional) | 20 canciones, solos, acciones sociales |
| `quantity` | Cantidad total con meta diaria **recalculada** | Libro de 200 páginas |
| `amount` | Dinero ganado (ventas cobradas) | 30.000.000 Gs |

Reglas:
- `weekly_counter`: contador `0/3` con botón grande. **Máximo 1 toque por día** (configurable). Al llegar a la meta: ✅ semana completa con animación. Reinicia cada lunes. Historial de semanas logradas (ej. 8 de 10).
- `quantity`: el usuario registra páginas leídas cada día. La **meta diaria se recalcula** = `páginas_restantes / días_restantes` (si se atrasa, sube; si adelanta, baja). Muestra "Hoy: 15 págs · Llevás 45/200".
- `checklist`: ítems agregables por el usuario; se pueden agrupar por **semana** o por **fase** (cada grupo con su meta, ej. "Semana 1: 5 de 5").
- Todas permiten editar días pasados y no permiten chequear días futuros.

### 3.4 Modos de progreso del objetivo
- `amount`: progreso = dinero **cobrado** / meta (ver sección 6.1).
- `activities`: promedio ponderado del cumplimiento de sus actividades en el período (daily_check = días cumplidos/días transcurridos; weekly_counter = semanas completas/semanas transcurridas; checklist = ítems hechos/total; quantity = cantidad/total).
- `quantity`: cantidad hecha / total.
- `effort_time`: horas acumuladas / horas estimadas por dificultad (para objetivos sin métrica clara).
- **Completado manual** siempre disponible (ej. "Conseguir novia" lo marca el usuario cuando ocurra).

### 3.5 Hitos
Un objetivo puede tener hitos con fecha límite y valor objetivo (ej. "5 ventas / 16.000.000 Gs antes del 15/ene/2027"). Estado: `pendiente`, `logrado`, `vencido`. Alertas a 14 y 3 días de la fecha.

### 3.6 Categorías de actividad
`trabajo`, `estudio`, `crecimiento`, `ejercicio`, `salud`, `social`, `musica`, `redes`, `ocio`, `descanso`, `otro`. **`redes` + `ocio` comparten un tope diario de 120 min.**

## 4. Onboarding
Barra de pasos, todo editable luego.
1. Bienvenida.
2. Datos: nombre, foto (opcional).
3. **Cargar mis objetivos y hábitos precargados**: mostrar el seed (15) con opción de aceptar todo, editar o descartar cada uno. Opción "Empezar desde cero".
4. Objetivos propios (omitible), hábitos rutinarios, hábitos de propósito.
5. Idioma que estudia (texto libre; se usa en la etiqueta del contador de idiomas).
6. Límites: redes+ocio **120 min/día**, ejercicio **3 días/semana**.
7. Permiso de **Acceso de uso** (Android): explicar para qué sirve, abrir el ajuste del sistema, elegir apps de `redes` y `ocio`. Omitible (carga manual).
8. Recordatorios.
9. Home.

## 5. Pantallas

### 5.1 Home (arriba → abajo)
1. Header: foto de perfil (→ editar perfil), saludo, ☰.
2. **Tarjeta de Estado**: nivel, color, ícono, frase motivadora (estilo Brian Tracy), % de la semana, "¿Por qué?".
3. **Ahora en tu horario**: bloque actual y el siguiente (ej. "Desarrollo · 08:00–10:00 → Ventas 10:00"). Toca → sección Horario.
4. **Hábitos de hoy** (check de 1 toque, racha 🔥).
5. **Hoy en tus objetivos**: resumen de pendientes del día por objetivo, con barra de progreso global y badge de ritmo (Adelantado / En ritmo / Atrasado / En riesgo) y días restantes. Tocar → detalle donde se hacen los checks.
6. **Balance de tiempo**: barras redes+ocio vs tope, estudio, trabajo, crecimiento. Selector: Hoy · Ayer · Esta semana · Semana pasada · Este mes · Mes pasado · Personalizado.
7. Botón (+): hábito, registrar tiempo, diario, venta/prospecto.

### 5.2 Menú ☰
Escribir diario · Historial de diarios (búsqueda) · Historial de días (calendario) · **Horario** · Objetivos · **Ventas** (solo si hay un objetivo `amount`) · Hábitos · Estadísticas · Frases motivadoras (favoritas y "Esenciales para sostener rutinas") · Editar perfil · Configuración · Información.

### 5.3 Detalle de objetivo
Pestañas:
- **Resumen**: progreso, ritmo, proyección ("Al ritmo actual lo lograrías el…"), fecha límite, hitos.
- **Actividades**: todas con su control (check / +1 / páginas / lista), agrupadas por semana o fase cuando corresponda. Aquí se hace todo el check.
- **Semanas**: tarjetas semana a semana con meta y resultado (✅/❌, X de Y).
- **Tiempo**: minutos por actividad en el período.
- **Ventas** (solo objetivo `amount`): ver 5.5.

### 5.4 Horario (sección nueva)
- **Vista semanal**: grilla Lun–Dom × horas (06:00–23:00), bloques con color y texto, como la imagen adjunta. Línea de "ahora".
- **Vista del día**: lista de bloques de hoy con el actual resaltado.
- Cada bloque: título, días, hora inicio/fin, color, categoría y **vínculo opcional** a un objetivo o hábito (al tocarlo, abre ese objetivo).
- Crear, editar, duplicar y borrar bloques; arrastrar para ajustar duración (si es simple; si no, editar con selector de hora).
- Recordatorio opcional al comenzar un bloque (texto genérico: "Comienza tu siguiente bloque").
- Resumen semanal de horas planificadas por categoría.
- Seed en 15.5.

### 5.5 Ventas (objetivo de dinero)
- **Panel**: cobrado vs meta (barra), vendido pendiente de cobro, promedio por venta, proyección a la fecha, próximo hito.
- **Ventas**: lista (cliente, descripción, monto acordado, monto cobrado, estado `pendiente/cobrado parcial/cobrado`, fecha). Cada cobro suma al progreso. Soporta adelanto (ej. 50/50).
- **Prospectos (mini CRM)**: nombre, contacto, origen (red cálida, redes, gym/facu, referido), estado (`por contactar` → `contactado` → `reunión` → `propuesta enviada` → `ganado` / `perdido`), próximo seguimiento con fecha, notas. Al pasar a `ganado` ofrece crear la venta.
- **Embudo semanal**: contactos nuevos, respuestas, reuniones, propuestas, ventas y tasa de conversión (alimenta el ritmo y la revisión semanal).
- Recordatorio de seguimientos del día (genérico: "Tenés seguimientos pendientes").

### 5.6 Estadísticas
Selector de período (mismo que Home): % de hábitos y actividades cumplidos (con comparación ▲▼), gráfico por día, balance de tiempo, rachas, aviso de ejercicio, semanas logradas de cada contador, embudo de ventas.

### 5.7 Diario y revisión semanal
Diario: entrada por día, ánimo 1–5, historial con búsqueda. **Revisión semanal (domingo)**: % cumplido, mejor/peor hábito, resultado de cada objetivo, embudo de ventas, y una pregunta de reflexión guardada en el diario. Para la meta social incluir un cierre diario de 2 líneas: "¿Qué hice hoy? ¿Qué aprendí?".

## 6. Progreso y ritmo

### 6.1 Dinero (modo `amount`)
- `progreso = min(100, cobrado_acumulado / meta × 100)`.
- Ritmo: comparar contra el **plan de hitos** (interpolación lineal entre hitos) y contra el tiempo transcurrido.
- Proyección: `cobrado_por_semana_promedio` (últimas 4 semanas, o desde el inicio si hay menos) × semanas restantes.

### 6.2 Ritmo general
`diferencia = progreso_real − progreso_esperado`: `≥ +10` Adelantado · `−10…+10` En ritmo · `< −10` Atrasado · `< −30` En riesgo. Sin fecha límite → solo se muestra cumplimiento semanal. Si el objetivo vence sin completarse → `vencido` y se ofrece extender o archivar. Aviso a 90/60/30/14/3 días.

### 6.3 Objetivo "Conseguir novia" (resultado no controlable)
Se mide por **acciones** (porcentaje de actividades cumplidas). El estado final se marca manualmente. La pantalla muestra dos números: "Acciones cumplidas: X %" y "Resultado: pendiente / logrado".

## 7. Estado general

| Nivel | Nombre | Puntaje |
|---|---|---|
| 1 | Muy mal | 0–14 |
| 2 | Mal | 15–29 |
| 3 | Decepcionante | 30–44 |
| 4 | Más o menos | 45–59 |
| 5 | Bien | 60–74 |
| 6 | Excelente | 75–89 |
| 7 | ¡A tope! 🚀 | 90–100 |

Puntaje 0–100 sobre los **últimos 7 días móviles** (más peso a los recientes):
- **45 %** cumplimiento: hábitos diarios + actividades de objetivos que tocaban en el período.
- **25 %** balance: `(trabajo + estudio + crecimiento)` vs `(redes + ocio)`.
- **15 %** ejercicio: 0 días = 0; meta 3 días/semana.
- **15 %** avance de objetivos (ritmo promedio de los activos).

Reglas: redes+ocio sobre 120 min/día varios días seguidos → restar hasta 15 pts y avisar · semana sin ejercicio → tope "Bien" · menos de 2 días de datos → "Empezando…" · cada nivel con color, ícono, mensaje y **recomendación accionable** · "¿Por qué este estado?" con el desglose.

## 8. Tiempo y barras de balance

- **Automático (Android)**: `UsageStatsManager` (permiso "Acceso de uso") mediante un módulo nativo / config plugin en Kotlin. Suma el uso diario de las apps marcadas `redes` u `ocio`.
- **Manual y cronómetro**: actividades de objetivos, hábitos con tiempo, ocio fuera del teléfono.
- Cada `TimeLog` guarda `source`: `system`, `timer`, `manual`. Sin permiso → funciona manual con aviso discreto.
- **Barras**: redes+ocio contra el tope (verde < 80 %, amarillo hasta 100 %, rojo si lo supera; en períodos largos tope × días). Estudio, trabajo y crecimiento contra metas configurables (por defecto estudio 180 min/día por la facultad, trabajo 240 min/día, crecimiento 60 min/día).
- Ratio: "Por cada hora de redes/ocio dedicaste X h a estudio/trabajo/crecimiento".

## 9. Frases motivadoras
`quotes.json`: `id`, `texto`, `autor`, `categoria` (`constancia`, `disciplina`, `objetivos`, `energia`, `reinicio`), `esencial`, `favorita`. Autor principal Brian Tracy; **no inventar citas atribuidas a personas reales** (si hay duda: "Anónimo" o texto propio; dejar unas 10 de ejemplo con `// TODO verificar atribución`). Frase según el nivel del Estado, una nueva por día, favoritas y compartir. Sección "Esenciales para sostener rutinas" (mínimo 30, las carga el usuario).

## 10. Recordatorios (notificaciones locales)
**Texto genérico, sin nombrar el hábito.** Ejemplos: "Aún no realizaste una actividad pendiente.", "Te queda una actividad por completar hoy.", "Tenés seguimientos pendientes.", "Comienza tu siguiente bloque." Un recordatorio diario si queda algo sin chequear; aviso al llegar al 80 % y al superar el tope de redes+ocio; aviso de hitos y fechas límite; recordatorio de contador semanal el jueves si va por debajo del ritmo ("Esta semana aún te faltan sesiones").

## 11. Datos y respaldo
Todo local. Respaldo: **exportar/importar JSON** + **Android Auto Backup** (incluir la base SQLite). Capa de repositorios para agregar después respaldo en Google Drive (carpeta oculta) o backend sin tocar la lógica. Para Play Store: política de privacidad y justificar el permiso de acceso de uso (sin servidor).

## 12. Modelo de datos (SQLite)

```
User(id, name, avatar_uri, language_studied, settings_json, onboarding_done, created_at)

Habit(id, name, emoji, category, tracking[check|time], target_minutes NULL,
      frequency_json, color, archived, enabled, sort_order, created_at)
HabitLog(id, habit_id, date, done, minutes)             -- único (habit_id, date)

Goal(id, title, category, priority, start_date, due_date NULL, progress_mode,
     target_amount NULL, unit NULL, status, manual_done, completed_at, notes)
Milestone(id, goal_id, title, due_date, target_value NULL, target_value2 NULL, status)

Activity(id, goal_id, title, kind, category, weekly_target NULL, days_of_week_json NULL,
         start_date NULL, end_date NULL, total_quantity NULL, unit NULL,
         group_label NULL, daily_minutes_target NULL, sort_order, archived)
ChecklistItem(id, activity_id, title, due_date NULL, group_label NULL, done, done_at)
ActivityLog(id, activity_id, date, value, done, minutes)  -- value: +1, páginas, etc.

Sale(id, goal_id, client, description, amount_agreed, date, status)
Payment(id, sale_id, amount, date)                        -- suma al progreso (cobrado)
Prospect(id, name, contact, source, status, next_followup NULL, notes, sale_id NULL,
         created_at, updated_at)

ScheduleBlock(id, days_json, start, end, title, color, category, goal_id NULL,
              habit_id NULL, reminder_enabled, sort_order)

TimeLog(id, date, minutes, category, activity_id NULL, habit_id NULL, source, note)
TrackedApp(package_name, label, category[redes|ocio])
JournalEntry(id, date UNIQUE, text, mood NULL, created_at, updated_at)
Quote(id, text, author, category, essential, favorite)
StatusSnapshot(id, date, score, level, breakdown_json)
WeeklyReview(id, week_start, summary_json, reflection_text)
```
Fechas `YYYY-MM-DD` locales. Índices por `date`, `goal_id`, `activity_id`.

## 13. Diseño — tema oscuro azul medianoche
Tokens: `background #0B1026` · `surface #131A3A` · `surfaceAlt #1C2552` · `border #2A3470` · `primary #4F7CFF` · `primarySoft #7AA2FF` · `text #E8ECFF` · `textMuted #8A94C8`. Estado: `#E5484D` · `#F76B15` · `#F5A524` · `#E5D04F` · `#46C281` · `#3AB5E5` · `#8B7BFF` (con brillo). Tarjetas redondeadas, animación y vibración suave al chequear, contador semanal con botón grande, estados vacíos amigables, fuentes escalables, buen contraste.

## 14. Estructura de carpetas
```
/app (Expo Router): (onboarding), (tabs)/index, habits, goals/[id], schedule, sales, stats, journal, quotes, settings
/src: db, domain (status, goalProgress, weeklyCounter, quantityPlan, milestones, streaks, timeBalance, periods),
      native (UsageStats Kotlin), components, store, i18n, theme, data (seed.ts, quotes.json)
DECISIONS.md
```
`/domain` = funciones puras con tests (Jest).

---

## 15. DATOS SEMILLA (cargar como iniciales y editables)

### 15.1 Hábitos diarios (check)
Activos por defecto:
1. 🧘 Meditar
2. 👄 Decir las afirmaciones (autosugestión)
3. 💰 Verse en posesión del dinero y realizando las actividades
4. 🙋 Imaginarme a mi yo ideal
5. 📺 Ver videos de desarrollo personal

Sugeridos (desactivados, el usuario los activa): 📝 Plan del día (3 prioridades, 5 min) · 🌙 Cierre del día en el diario (2 líneas: qué hice y qué aprendí) · 💧 Tomar agua · 😴 Dormir a hora fija.

### 15.2 Objetivo 1 — Ganar 30.000.000 Gs (prioridad 1)
- Fecha límite **1/mar/2027** · modo `amount` · meta 30.000.000 Gs cobrados · categoría `trabajo`. Inicio 6/oct/2026 (146 días, ~21 semanas).
- Estrategia: vender **sistemas y webs a medida** a organizaciones y personas. Mezcla de referencia para llegar a la meta con **8 ventas**: 3 landings (≈2.000.000) + 4 webs/catálogos con WhatsApp (≈3.500.000) + 1 sistema a medida (≈10.000.000). Precios **orientativos, a validar** con el mercado local. Mantenimiento mensual (≈150.000–300.000 Gs) como ingreso extra. Modalidad de cobro sugerida: 50 % adelanto / 50 % entrega.

**Hitos (acumulado cobrado):**
| Hito | Fecha límite | Ventas | Cobrado acumulado |
|---|---|---|---|
| Oferta definida (nicho, 3 paquetes, precios) + lista de 50 prospectos | 13/oct/2026 | – | – |
| Demo 1 online + 10 contactos de red cálida | 18/oct/2026 | – | – |
| 3 propuestas enviadas | 31/oct/2026 | – | – |
| **Primera venta** | **15/nov/2026** (meta ideal 8/nov) | 1 | 2.000.000 |
| 3 ventas | 15/dic/2026 | 3 | 8.000.000 |
| **5 ventas** | **15/ene/2027** | 5 | 16.000.000 |
| 7 ventas | 10/feb/2027 | 7 | 24.000.000 |
| **8 ventas = meta** | **1/mar/2027** | 8 | 30.000.000 |

Notas del plan: hasta el 20/nov (facultad) dedicar ~2 h/día a ventas+aprendizaje; desde el 21/nov subir a 3 h/día y a más tiempo de entrega. Enero suele ser lento: adelantar prospección en diciembre.

**Actividades:**
- `daily_check` **Desarrollo** (2 h; minutos opcionales), lun–dom.
- `daily_check` **Ventas y prospección** (lun–vie, 1–2 h): 30 min aprender + prospectar + seguimientos.
- `weekly_counter` **Contactos nuevos** meta **10/semana** (desde 12/oct), con conteo por toques (se permite más de 1 por día en este contador).
- `weekly_counter` **Reuniones o llamadas** meta 2/semana (desde 26/oct).
- `weekly_counter` **Publicar contenido o caso de éxito** meta 2/semana (desde 19/oct).
- `weekly_counter` **Seguimiento de prospectos** meta 5/semana.
- `checklist` **Portafolio**: Demo 1 landing para negocio local (18/oct) · Demo 2 web con catálogo y botón de WhatsApp (1/nov) · Demo 3 mini sistema (turnos/reservas o inventario) (15/nov) · Perfil profesional y portafolio online (18/oct) · Plantilla de propuesta y contrato simple (20/oct).
- `checklist` **Aprendizaje de ventas y marketing**: Curso de ventas consultivas (elegir uno) (31/oct) · Meta Blueprint (cursos gratuitos de anuncios en Facebook/Instagram) (30/nov) · Google Business Profile y SEO local básico (15/nov) · Libro "The Psychology of Selling" (Brian Tracy) (30/nov) · Cómo cotizar y negociar (15/nov).
- `checklist` **Ruta técnica** (el usuario completa con su ruta de tecnologías/herramientas/lenguajes; incluir: desplegar un sitio, integrar WhatsApp, formulario→base de datos, panel de administración, pagos locales). Agrupar por semana.

### 15.3 Objetivo 2 — Conseguir novia (prioridad 2)
- Fecha límite **domingo 25/oct/2026** · modo `activities` + completado manual (6.3).
- Semanas: **S1 = 6–11/oct (nivel fácil)**, **S2 = 12–18/oct (nivel medio)**, **S3 = 19–25/oct (nivel difícil)**. Cada semana es un grupo de checklist con su meta.

**Semana 1 (6–11/oct) — fácil.** Meta de la semana: completar las diarias 6 días y 3 mini-charlas.
- Diaria: saludar a **2–4 personas** del gym (contador 0–4 por día).
- Diaria: hacerle **una pregunta a un desconocido** (hora, dirección, recomendación).
- Diaria: dar las gracias o decir "buen día" con contacto visual y sonrisa a 3 personas.
- Semanal ×3: mini-charla de 1–2 minutos con alguien distinto (cajero, compañero, vecino).
- Semanal ×2: aprender y usar el **nombre** de dos personas del gym o la facu.
- Cierre diario: 2 líneas en el diario.

**Semana 2 (12–18/oct) — medio.**
- ×4 charlas de 3–5 minutos con alguien nuevo.
- ×3 cumplidos **no físicos** (actitud, habilidad, ropa, constancia) a personas distintas.
- ×3 pedir una opinión o recomendación a un desconocido que genere charla.
- ×2 hablar con una chica en la facu, el gym o idiomas (conversación breve).
- ×1 actividad social (clase grupal, jam, evento o reunión de música).
- ×2 conectar por Instagram/WhatsApp con gente conocida del entorno.
- Seguir con el saludo diario del gym.

**Semana 3 (19–25/oct) — difícil.**
- ×3 invitaciones a un plan (café, estudiar juntos, entrenar, escuchar música).
- ×2 pedir contacto (Instagram/WhatsApp) a personas con quienes hubo buena charla.
- ×2 charlas de 10 minutos con una chica nueva.
- ×1 **cita o salida** con una chica (meta: antes del 25/oct).
- ×1 tocar o cantar en público o en una juntada (open mic).
- ×3 hacer un pedido donde la respuesta puede ser "no" (entrenar el manejo del rechazo).
- Domingo 25/oct: revisión del objetivo y planificación de las próximas semanas.

**Actividades de apoyo:**
- `quantity` **Libro de sociabilidad**: 200 páginas, fecha límite **20/oct/2026**, inicio 6/oct, meta diaria recalculada (≈15 págs/día; terminar el 19/oct y dejar el 20 de margen). Al terminar cada capítulo, anotar **una idea para aplicar** hoy.
- `scheduled_days` **Video sobre atracción/sociabilidad** lun/mié/vie del 6 al 25/oct = **8 videos** (S1: mié 7 y vie 9; S2: lun 12, mié 14, vie 16; S3: lun 19, mié 21, vie 23). Después de cada video, anotar una acción para practicar ese mismo día.

Notas éticas del plan (mostrar como texto de ayuda): conversar para conocer gente de verdad, respetar siempre un "no", no insistir ni presionar. Un rechazo cuenta como práctica cumplida.

### 15.4 Otros objetivos
**Objetivo 3 — Aprender idiomas** (prioridad 3, **sin fecha**, modo `activities`): `weekly_counter` **Sesión de idiomas meta 3/semana** (botón +1, máx. 1 por día, lun–dom). Etiqueta usa el idioma elegido en el onboarding. Recomendación: una de las 3 sesiones con práctica de **hablar**.

**Objetivo 4 — Música: cantar y guitarra** (prioridad 4, sin fecha general, modo `activities`):
- `daily_check` **Práctica de canto/vocalización** lun/mié/vie.
- `daily_check` **Práctica de guitarra** mar/jue/sáb/dom.
- `checklist` **20 canciones bien aprendidas — fecha límite 6/nov/2026**, en 4 grupos semanales de 5: S1 6–12/oct, S2 13–19/oct, S3 20–26/oct, S4 27/oct–2/nov, con 3–6/nov de repaso. El usuario carga los títulos. Ítem "bien aprendida" = letra, melodía y una grabación.
- `checklist` **Curso de guitarra** (el usuario carga las lecciones; lecciones por semana editable).
- `weekly_counter` **Solos de guitarra aprendidos** meta **2/semana**, y `checklist` **Lista de solos a aprender** (el usuario la carga; marcar uno suma al contador).
- `weekly_counter` **Grabarme cantando o tocando** meta 1/semana.

**Objetivo 5 — Pasar las materias de la facultad** (prioridad 2 en urgencia, fecha límite **20/nov/2026**, modo `activities`):
- `daily_check` **Estudiar 3 h** (con minutos opcionales), lun–dom.
- `checklist` **Materias y exámenes** (el usuario carga cada materia con su fecha de parcial/final).
- `weekly_counter` **Repaso con práctica** (exámenes anteriores o ejercicios) meta 2/semana.
- Recomendación de método: bloques de 50 min estudio + 10 min descanso; priorizar recordar activamente (preguntas y práctica) sobre releer.

Orden en el Home: por **fecha límite más cercana**, luego por prioridad.

### 15.5 Horario (seed de `ScheduleBlock`)
Reproduce la imagen adjunta, con **3 ajustes propuestos marcados `suggested`** (el usuario puede revertirlos): (a) Desarrollo se reduce a 8–10 y se agrega **Ventas y prospección 10–12** (mejor horario para contactar negocios); (b) los martes y jueves 16–18 pasan a **Social/Networking (flex)**, porque el objetivo de idiomas pide 3 sesiones por semana; (c) 12–13 queda libre como almuerzo y colchón.

Días: `mon`,`tue`,`wed`,`thu`,`fri`,`sat`,`sun`.

```json
[
 {"days":["mon","tue","wed","thu","fri"],"start":"06:00","end":"08:00","title":"Meditar, leer, personal","color":"#00B0F0","category":"crecimiento"},
 {"days":["sat","sun"],"start":"06:00","end":"07:00","title":"Libre","color":"#BFBFBF","category":"descanso"},
 {"days":["sat","sun"],"start":"07:00","end":"09:00","title":"Meditar, leer, personal","color":"#00B0F0","category":"crecimiento"},

 {"days":["mon","tue","wed","thu","fri"],"start":"08:00","end":"10:00","title":"Desarrollo","color":"#ED7D31","category":"trabajo","goal":"ganar-30m"},
 {"days":["mon","tue","wed","thu","fri"],"start":"10:00","end":"12:00","title":"Ventas y prospección","color":"#C55A11","category":"trabajo","goal":"ganar-30m","suggested":true},
 {"days":["mon","tue","wed","thu","fri"],"start":"12:00","end":"13:00","title":"Libre / almuerzo","color":"#3A3F5C","category":"descanso","suggested":true},
 {"days":["sat","sun"],"start":"09:00","end":"11:00","title":"Desarrollo","color":"#ED7D31","category":"trabajo","goal":"ganar-30m"},
 {"days":["sat","sun"],"start":"11:00","end":"13:00","title":"Libre","color":"#3A3F5C","category":"descanso"},

 {"days":["mon","tue","wed","thu","fri","sat","sun"],"start":"13:00","end":"16:00","title":"Estudios facu","color":"#FFD966","category":"estudio","goal":"facultad"},

 {"days":["mon","wed","fri","sat","sun"],"start":"16:00","end":"18:00","title":"Idiomas","color":"#548235","category":"estudio","goal":"idiomas"},
 {"days":["tue","thu"],"start":"16:00","end":"18:00","title":"Social / networking (flex)","color":"#7A5BD6","category":"social","goal":"novia","suggested":true},

 {"days":["mon","tue","wed","thu","fri","sat","sun"],"start":"18:00","end":"20:00","title":"Ejercicios","color":"#212934","category":"ejercicio"},

 {"days":["mon","wed","fri"],"start":"20:00","end":"23:00","title":"Vocalización y cantar","color":"#2F5597","category":"musica","goal":"musica"},
 {"days":["tue","thu","sat","sun"],"start":"20:00","end":"23:00","title":"Guitarra","color":"#2F5597","category":"musica","goal":"musica"}
]
```
Rutina fija diaria sugerida dentro de los bloques: Desarrollo (aprender + construir portafolio) · Ventas 10–12 = 30 min aprender + 60 min prospectar (10 contactos) + 30 min seguimientos/contenido · gym 18–20 = hacer los saludos de la meta social.

---

## 16. Funcionalidades extra
**v1:** rachas con día de gracia · editar días pasados · archivar en vez de borrar · exportar datos · modo "día difícil" (versión mínima) · revisión semanal · contador semanal con historial · meta diaria recalculada en libros/cantidades.
**v1.5:** widget del día · logros/insignias · plantillas de objetivos · hábitos "si-entonces".
**v2:** respaldo en Drive o nube, versión iOS (registro manual de tiempo), salud (Google Fit/Apple Health), socios de responsabilidad.

## 17. Plan de implementación (fases)
1. **Base**: Expo + TS, dev build, navegación, tema, SQLite, migraciones, seed.
2. **Onboarding y perfil** (carga del seed).
3. **Hábitos diarios** + Home + rachas.
4. **Objetivos y actividades**: los 6 tipos, detalle con checks, semanas, hitos.
5. **Horario**: grilla semanal, vista del día, bloque "Ahora", seed.
6. **Ventas**: ventas, cobros, prospectos, embudo, progreso por dinero.
7. **Tiempo y Estado**: cronómetro, módulo Android de uso de apps, barras de balance, cálculo del Estado, frases.
8. **Diario, menú, historiales, estadísticas, revisión semanal**.
9. **Recordatorios, exportación/respaldo, pulido y tests**.

## 18. Criterios de aceptación (v1)
- [ ] Onboarding carga el seed y permite editarlo/descartarlo.
- [ ] Los checks de actividades de objetivos se hacen **dentro del objetivo**; el Home solo resume.
- [ ] Contador semanal de idiomas: +1 por día, completa al llegar a 3, reinicia el lunes y guarda historial.
- [ ] Libro de 200 págs: la meta diaria se recalcula según lo leído y los días restantes.
- [ ] Videos lun/mié/vie (8 en total hasta el 25/oct) aparecen solo esos días.
- [ ] Objetivo de 30 M: ventas y cobros suman al progreso; hitos con fecha y ritmo; mini CRM y embudo.
- [ ] Objetivo social por semanas (S1/S2/S3) con metas y checks; "logrado" se marca manualmente.
- [ ] Sección Horario con grilla, vista del día, bloque "Ahora" y edición.
- [ ] Estado de 7 niveles (con tests), barras de balance en todos los períodos, lectura de uso de apps en Android con permiso.
- [ ] Recordatorios con texto genérico, sin nombrar actividades.
- [ ] Todo funciona offline, con exportación/importación; texto en español, tema azul medianoche.
