# HabitPlan

Una web app sencilla para tus hábitos, objetivos y horario. Español, tema azul medianoche y diseño para computadora y celular. Sin cuenta, servidor de datos ni dependencias de ejecución.

## Abrir la app

**La forma más fácil:** descargá el repositorio (Code → Download ZIP), descomprimilo y abrí `index.html` con doble clic en Chrome, Edge o Firefox. No hace falta instalar nada.

Alternativa con Node instalado:

```powershell
npm start
```

Abrí **http://localhost:4173**. No necesita `npm install` para iniciar: el servidor usa las herramientas incluidas con Node.

## Qué podés hacer

- **Hoy:** chequear hábitos de hoy o días pasados, crear/editar/eliminar hábitos y activar sugeridos.
- **Objetivos:** crear/editar/eliminar objetivos y actualizar el progreso manualmente; para una meta de dinero, registrar el total cobrado en Gs. Marcar el resultado como completado es independiente del avance.
- **Horario:** ver cada día, crear/editar/eliminar bloques, elegir días y colores. No permite bloques superpuestos.
- **Respaldo:** descargar e importar un JSON con todo tu plan.

Se incluyen tus 9 hábitos (5 activos), 5 objetivos con fechas originales y 14 bloques. Las fechas no se cambian al abrir la app.

Los datos se guardan en el navegador. Al limpiar sus datos se pueden perder: descargá respaldos. El archivo local, localhost y una web publicada tienen almacenamientos separados. Para cambiar de navegador, dirección o dispositivo, exportá y después importá tu respaldo. No hay sincronización automática ni importación de la antigua base SQLite móvil. El guardado al abrir archivos con doble clic puede variar por navegador; para un uso diario estable, usá localhost o una web publicada. [Referencia de localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

## Subir y publicar

El proyecto está conectado a `https://github.com/jkuanavalos-ux/HabitPlan.git`, rama `main`.

### Vercel

1. Entrá a Vercel → **Add New → Project** e importá **jkuanavalos-ux/HabitPlan** desde GitHub.
2. Dejá **Root Directory** en la raíz del repositorio.
3. Pulsá **Deploy**. La configuración de `vercel.json` selecciona **Other**, omite instalar dependencias y genera los archivos públicos en `dist`.

No necesitás variables de entorno, base de datos ni ejecutar `npm start` en Vercel. La app conserva los datos en el navegador del visitante. La dirección definitiva la asigna Vercel al publicar. Si ya usabas la app local, exportá tu respaldo e importalo en la nueva dirección.

Para probar la preparación de archivos localmente: `npm run build`. Solo copia los seis archivos de la app, sin publicar documentación, tests ni dependencias. [Configuración oficial de Vercel](https://vercel.com/docs/project-configuration/vercel-json).

### GitHub Pages (alternativa)

Para publicar con GitHub Pages, en el repositorio abrí **Settings → Pages → Deploy from a branch → main → / (root) → Save**. Cuando GitHub confirme la publicación, la dirección esperada es `https://jkuanavalos-ux.github.io/HabitPlan/`. No hay build. Los datos iniciales personales del plan quedan visibles a los visitantes si publicás; los cambios de cada visitante permanecen en su propio navegador. [Guía oficial de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

```powershell
git add .
git commit -m "Actualizar HabitPlan"
git push
```

## Desarrollo y tests

```powershell
npm ci
npm run check
npm test
```

Jest es la única dependencia y se usa solo para tests. La lógica está en `src/domain/planner.js` como funciones puras.

Estructura: `index.html`, `web/` (interfaz y datos iniciales), `src/domain/` (lógica y tests), `scripts/serve.cjs` (servidor opcional). `docs/horario.PNG` conserva la referencia visual original.

La implementación móvil anterior está en el historial de Git, commit `33b8bd9`. Esta versión web reemplaza el plan de fases móviles. Decisiones en `DECISIONS.md`; verificaciones en `VALIDATION.md`.
