# HabitPlan web — decisiones

- La instrucción de convertir y simplificar reemplaza la especificación móvil y su restricción por fases. La versión Expo anterior se conserva en el historial Git (`33b8bd9`).
- HTML, CSS y JavaScript sin framework ni dependencias de ejecución. Scripts clásicos con rutas relativas: funcionan al abrir `index.html`, en localhost y en hosting estático.
- Tres secciones: Hoy, Objetivos y Horario. Se quitan onboarding, Estado puntuado, CRM, cronómetro, notificaciones, Kotlin, SQLite/migraciones, Router, Expo, Drizzle, TypeScript y módulos de fases futuras.
- Se conservan 9 hábitos (5 activos), 5 objetivos y sus notas, y 14 bloques; fechas y colores originales. Actividades, hitos y ventas detalladas se reemplazan por porcentaje manual y total cobrado. Estos porcentajes no se presentan como cumplimiento automático.
- El seed solo se carga si no hay datos guardados; no resucita filas borradas ni reemplaza ediciones. No hay transferencia de la base SQLite; la app nativa no llegó a instalarse/probarse en esta sesión.
- Guardado en localStorage bajo `habitplan.web.v1`. Checks por fecha local, días futuros bloqueados. Primero se persiste el cambio; si falla, el plan anterior se conserva. Lectura dañada bloquea escrituras y permite descargar los datos originales para recuperación.
- Importar valida y pide confirmar antes de reemplazar. Respaldo JSON completo. Sin sincronización entre dispositivos, direcciones o navegadores.
- El horario conserva los ajustes propuestos originales. Editar quita la marca de sugerido. Se rechazan bloques superpuestos y bloques que crucen medianoche.
- Cálculos y validaciones puros en `/src/domain`, con Jest. El servidor opcional usa Node sin instalar dependencias.
- GitHub Pages queda documentado; no se activa automáticamente porque se pidió actualizar el repositorio. Se puede abrir la app sin publicar nada.
- Vercel: configuración estática `Other`, sin instalación de dependencias; un script Node genera `dist/` con solo los seis archivos públicos. Se publica esta configuración a GitHub para que el usuario importe el proyecto en su cuenta Vercel. No se crea un despliegue Vercel ni se inventa una URL.
