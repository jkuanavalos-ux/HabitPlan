// Produce only the browser app; documentation and tests are not published.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.resolve(root, 'dist');
if (path.relative(root, output) !== 'dist') throw new Error('Carpeta de salida inválida');
const files = [
  'index.html',
  'web/app.js',
  'web/seed.js',
  'web/styles.css',
  'web/favicon.svg',
  'src/domain/planner.js',
];
// Check sources before replacing a previous build.
for (const file of files) if (!fs.statSync(path.join(root, file)).isFile()) throw new Error(`Falta ${file}`);
fs.rmSync(output, { recursive: true, force: true });
for (const file of files) {
  const target = path.join(output, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(root, file), target);
}
const html = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
for (const [, asset] of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  if (!fs.existsSync(path.join(output, asset))) throw new Error(`Recurso faltante: ${asset}`);
}
console.log(`HabitPlan listo para publicar: ${files.length} archivos en dist/.`);
