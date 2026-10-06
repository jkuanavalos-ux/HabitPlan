const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
const server = http.createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    const relative = path.relative(root, file).replaceAll('\\', '/');
    // Only expose app assets, never Git metadata, tests or dependencies.
    if (relative !== 'index.html' && !/^web\/[^/]+\.(js|css|svg)$/.test(relative) && relative !== 'src/domain/planner.js') {
      response.writeHead(404); response.end('No encontrado'); return;
    }
    const data = fs.readFileSync(file);
    response.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    response.end(data);
  } catch { response.writeHead(404); response.end('No encontrado'); }
});
server.on('error', error => { console.error(`No se pudo abrir el servidor: ${error.message}`); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`HabitPlan: http://localhost:${port}\nAbrí esa dirección en tu navegador. Ctrl+C para cerrar.`));
