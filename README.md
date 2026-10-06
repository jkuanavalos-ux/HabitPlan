# HabitPlan · Fase 1

Base Android offline con Expo SDK 55, TypeScript, development build, Expo Router, tema azul medianoche, SQLite y Drizzle. Fuente funcional: `HABITPLAN_SPEC_v3.md`; referencia: `docs/horario.PNG`.

## Ejecutar en Android

Requisitos: Node 22.13 o posterior, npm, Android Studio con SDK/emulador o teléfono con depuración USB, y JDK 17 configurado para Android.

```powershell
npm ci
npm run android
```

El segundo comando genera el proyecto nativo, compila e instala el development build y abre Metro. Para las siguientes sesiones, con el build ya instalado:

```powershell
npm start
```

Abrir el development client de HabitPlan en el emulador o teléfono. No usar Expo Go. En teléfono físico, la computadora y el teléfono deben poder conectarse al servidor Metro.

Alternativa sin compilación Android local, con cuenta Expo/EAS:

```powershell
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform android --profile development
npm start
```

Instalar el APK que devuelve EAS y abrir HabitPlan. EAS configura el project ID de tu cuenta; no viene inventado en el repo. Después de instalar, los datos funcionan offline; durante desarrollo Metro sirve el código por red.

## Qué probar

1. Primera apertura: Inicio muestra **9 hábitos, 5 objetivos y 14 bloques**. No hay error de SQLite.
2. Hábitos: 5 activos y 4 sugeridos desactivados; nombres y emojis reales.
3. Objetivos: navegar a los cinco detalles y volver con el botón Android. Ver fechas: social 25/oct/2026, facultad 20/nov/2026, dinero 1/mar/2027; idiomas y música sin fecha general. Las actividades se muestran sin controles.
4. Bloques: colores originales y horarios de 15.5. Ventas, almuerzo y networking tienen marca de ajuste sugerido.
5. Menú: todas las rutas abren, y las secciones pendientes muestran su fase. Bienvenida todavía no ejecuta onboarding.
6. Cerrar completamente y volver a abrir: mismos datos, sin duplicados. Probar fuente grande y botones/gesto de volver.

## Verificaciones locales

```powershell
npm run typecheck
npm test
npm run check:db
npm run export:android
```

Jest verifica las funciones puras de calendario local en `src/domain`. El chequeo de SQLite ejecuta las migraciones y el seed de producción mediante Drizzle sobre SQLite real de Node: coincidencia de columnas, relaciones, unicidad, fechas, seed sin duplicados, respeto de ediciones/borrados y rollback ante fallos. No reemplaza probar `expo-sqlite` en Android.

## Datos y migraciones

- Base: `habitplan.db`, WAL y claves foráneas activadas. Drizzle es la capa de acceso detrás de repositorios.
- `src/db/schema.ts`: esquema; `src/db/migrations/*.sql`: migraciones versionadas; `bundled.ts`: SQL empaquetado para Metro.
- Para cambiar el esquema, editar `schema.ts` y ejecutar `npm run db:generate`. Versionar SQL, metadata y `bundled.ts` juntos; no modificar migraciones ya aplicadas.
- Seed transaccional de una sola carga, marcado en `AppMeta`; no se resetea al reiniciar. No hay botón de reset destructivo. Las fechas del seed no se mueven.
- Nombre de la app: constante `APP_NAME` en `src/data/app.json`, reexportada desde `src/constants.ts` y compartida con la configuración Expo.
- Decisiones y extensiones del modelo: `DECISIONS.md`.

## Pendiente

Fase 2: onboarding/perfil y aceptar, editar o descartar los datos iniciales. Fases 3–9: checks, Home real, objetivos, grilla/edición del horario, ventas, tiempo/Estado/UsageStats Kotlin, diario/estadísticas, notificaciones y exportación/respaldo. Dependencias de notificaciones/haptics/SVG disponibles, sin solicitar permisos ni implementar esas funciones en Fase 1.

Compilación e instalación del development build y validación visual/nativa requieren un entorno Android o EAS; ver `VALIDATION.md` para resultados reales de esta entrega.

Referencias de Expo: [development builds](https://docs.expo.dev/workflow/overview/) y [SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/).

## Subir a Git

El repositorio usa la rama `main`. Se versionan el código, el SPEC, la imagen de referencia, las migraciones completas y `package-lock.json`. Dependencias, caché, builds, bases de datos locales y credenciales están excluidos por `.gitignore`. `android/` e `ios/` se regeneran con Expo; no hace falta subirlos para esta fase.

Creá un repositorio vacío en tu servicio Git (sin README ni archivos iniciales) y reemplazá `URL_DEL_REPOSITORIO` por su URL:

```powershell
git add .
git commit -m "Base de HabitPlan: Fase 1"
git remote add origin URL_DEL_REPOSITORIO
git push -u origin main
```

Si el primer commit ya existe, omití las primeras dos líneas. Si Git solicita identidad, configurá tu nombre y correo reales con `git config user.name` y `git config user.email` antes de hacer el commit.

En otra computadora, cloná el repositorio, ejecutá `npm ci` y seguí los pasos Android de arriba. No se incluye una licencia de distribución hasta que el propietario elija una.
