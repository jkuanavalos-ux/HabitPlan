# Verificación de Fase 1

Una exportación del bundle no equivale a compilar un APK ni a probarlo en un teléfono.

Entorno: Windows, Node 22.20.0. No se detectaron Java ni adb en PATH; no hay dispositivo Android verificado. No se ejecutó EAS porque requiere cuenta/proyecto del usuario.

- `npm run typecheck`: pasó, TypeScript estricto sin errores.
- `npm test`: pasó, 1 suite / 6 tests de fechas locales y semana lunes–domingo.
- `npm run check:db`: pasó sobre SQLite real. 18 tablas del SPEC + AppMeta; coincidencia esquema/migración; seed con 9 hábitos (5 activos), 5 objetivos, 8 hitos, 14 bloques, acciones sociales 5/15/12 ítems por semana y 10 frases propias. Horario comparado directamente contra el JSON del SPEC. Videos programados: 8. Tablas de uso comienzan vacías.
- Verificados: FK, unicidad por hábito/día, seed idempotente, persistencia de ediciones y borrados, rollback de seed y migraciones, rechazo de versión futura del esquema.
- `npx expo install --check`: pasó contra las versiones oficiales del SDK.
- `npm run export:android`: pasó en la versión final, bundle Hermes generado en `dist`, 1255 módulos.
- `npx expo prebuild --platform android --no-install`: pasó en la versión final con expo-system-ui; generó proyecto nativo, paquete `com.habitplan.app`, schemes `habitplan` / `exp+habitplan` y `allowBackup=true`.

Pendiente: compilar/instalar APK development y probar navegación, apariencia, SQLite nativo y reapertura en Android. Instrucciones y checklist en README.md. Las funciones de Fases 2–9 no están implementadas.
