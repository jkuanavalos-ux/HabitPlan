# Verificación de la versión web

- `npm run check`: pasó; JavaScript sin errores de sintaxis.
- `npm test`: pasó, 1 suite y 14 tests de progreso, fechas locales, bloques actual/siguiente, duración diaria, superposiciones y validación de respaldos.
- Servidor local: respuestas HTTP 200 para index.html y los scripts. No expone `.git`, node_modules ni archivos arbitrarios.
- Navegador: carga inicial con 5 hábitos activos; check y recarga preservan el estado. Creación de un hábito de prueba y su check verificados en un origen separado (`127.0.0.1`), sin modificar el plan de la vista entregada (`localhost`).
- Objetivos: 15.000.000 Gs cobrados sobre 30.000.000 mostraron 50 %. Formulario y guardado verificados.
- Horario: un bloque 08–09 que se superponía fue rechazado; un bloque 05–06 fue aceptado; editar su nombre actualizó la lista.
- Responsive: probado a 390 y 1280 px; ancho del contenido dentro del viewport, sin desbordamiento horizontal. Vista móvil incluye acceso a Respaldo.
- La vista final se recargó tras los últimos cambios; no se registraron errores en la consola del navegador.
- Respaldo: formato validado en tests. El diálogo y el botón de descarga se probaron; el navegador integrado no devolvió el evento/archivo de descarga a la herramienta de automatización. El flujo de archivo descargado e importado no se verificó de extremo a extremo.
- Abrir `index.html` directo no requiere módulos ni fetch; la herramienta de navegador solo permite HTTP/HTTPS y bloqueó la verificación de `file://`. No se eludió ese bloqueo; la vista local HTTP sí se verificó. El guardado con file:// depende del navegador, documentado en README.

La versión móvil anterior está en el historial Git. Publicación GitHub Pages no activada: se actualiza el código del repositorio, listo para hosting estático.
