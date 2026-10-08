(function () {
  'use strict';
  const D = window.HabitDomain;
  const STORAGE_KEY = 'habitplan.web.v1';
  const dayNames = { mon: 'Lunes', tue: 'Martes', wed: 'Miércoles', thu: 'Jueves', fri: 'Viernes', sat: 'Sábado', sun: 'Domingo' };
  const categories = { trabajo: 'Trabajo', estudio: 'Estudio', crecimiento: 'Crecimiento', ejercicio: 'Ejercicio', salud: 'Salud', social: 'Social', musica: 'Música', redes: 'Redes', ocio: 'Ocio', descanso: 'Descanso', otro: 'Otro' };
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const formatMoney = value => new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 }).format(value);
  const shortDate = date => new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
  const uid = prefix => `${prefix}-${typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
  let state = D.validateState(window.HabitSeed);
  let selectedDate = D.localDate(new Date());
  let scheduleDay = D.dayCode(new Date());
  let editorContext;
  let loadBlocked = false;

  function notify(message) { $('notice').textContent = message; $('notice').hidden = false; }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) state = D.validateState(JSON.parse(saved));
  } catch {
    loadBlocked = true;
    notify('No pudimos leer los datos guardados. Para protegerlos, no vamos a sobrescribirlos. Podés descargar el respaldo e importar uno válido desde Respaldo.');
  }
  function save(next, replacing = false) {
    if (loadBlocked && !replacing) { notify('Importá un respaldo válido antes de guardar cambios. Los datos originales siguen en el navegador.'); return false; }
    try {
      const valid = D.validateState(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
      state = valid;
      loadBlocked = false;
      render();
      return true;
    } catch {
      notify('No se pudo guardar el cambio. El almacenamiento puede estar lleno o bloqueado por el navegador. El plan anterior se conserva.');
      return false;
    }
  }
  const copy = () => JSON.parse(JSON.stringify(state));
  function view() {
    const current = ['hoy', 'objetivos', 'horario', 'notas'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'hoy';
    for (const name of ['hoy', 'objetivos', 'horario', 'notas']) $('view-' + name).hidden = name !== current;
    document.querySelectorAll('[data-view]').forEach(link => { const active = link.dataset.view === current; link.classList.toggle('active', active); if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); });
    $('breadcrumb').textContent = { hoy: 'Mi día', objetivos: 'Mis objetivos', horario: 'Mi semana',  notas: 'Mis notas' }[current];
  }
  function iconAction(action, id, text, label, danger = false) {
    return `<button class="icon-button${danger ? ' danger' : ''}" data-action="${action}" data-id="${escape(id)}" aria-label="${escape(label)}" title="${escape(label)}">${text}</button>`;
  }
  function renderHabits() {
    const summary = D.dailyProgress(state.habits, state.logs, selectedDate);
    $('habit-count').textContent = `${summary.done} de ${summary.total} completados${selectedDate !== D.localDate(new Date()) ? ` · ${shortDate(selectedDate)}` : ''}`;
    $('habit-percent').textContent = `${summary.percent}%`;
    $('habit-progress').style.width = `${summary.percent}%`;
    $('habit-list').innerHTML = state.habits.filter(habit => habit.enabled).map(habit => {
      const done = state.logs[selectedDate]?.[habit.id] === true;
      return `<div class="habit-row${done ? ' done' : ''}"><button class="habit-check" data-action="check-habit" data-id="${escape(habit.id)}" aria-pressed="${done}" aria-label="${escape(`${done ? 'Desmarcar' : 'Completar'} ${habit.name}`)}">${done ? '✓' : ''}</button><span class="habit-emoji" aria-hidden="true">${escape(habit.emoji)}</span><span class="habit-name">${escape(habit.name)}</span><div class="row-actions">${iconAction('edit-habit', habit.id, '✎', `Editar ${habit.name}`)}${iconAction('delete-habit', habit.id, '×', `Eliminar ${habit.name}`, true)}</div></div>`;
    }).join('') || '<div class="empty">Tu día puede empezar con un solo hábito.<br>Creá uno o activá una sugerencia.</div>';
    $('suggestion-list').innerHTML = state.habits.filter(habit => !habit.enabled).map(habit => `<div class="suggestion-row"><span>${escape(habit.emoji)} ${escape(habit.name)}</span><button class="button small" data-action="enable-habit" data-id="${escape(habit.id)}">Activar</button>${iconAction('edit-habit', habit.id, '✎', `Editar ${habit.name}`)}${iconAction('delete-habit', habit.id, '×', `Eliminar ${habit.name}`, true)}</div>`).join('') || '<p class="footnote">No quedan sugerencias. Podés crear tus propios hábitos.</p>';
  }
  function sortedGoals() {
    return [...state.goals].sort((a, b) => Number(a.done) - Number(b.done) || (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
  }
  function goalCard(goal, compact) {
    const percent = D.goalProgress(goal);
    const overdue = goal.dueDate && goal.dueDate < D.localDate(new Date()) && !goal.done;
    return `<article class="goal-card${goal.done ? ' completed' : ''}" data-action="view-goal" data-id="${escape(goal.id)}"><div class="goal-top"><span class="category-tag">${escape(categories[goal.category] || goal.category)}</span>${compact ? '' : `<div class="row-actions">${iconAction('edit-goal', goal.id, '✎', `Editar ${goal.title}`)}${iconAction('delete-goal', goal.id, '×', `Eliminar ${goal.title}`, true)}</div>`}</div><h3><button type="button" class="goal-title-button" data-action="view-goal" data-id="${escape(goal.id)}" title="Ver detalle y notas">${escape(goal.title)}</button></h3><div class="goal-due${overdue ? ' overdue' : ''}">${goal.done ? '✓ Completado' : goal.dueDate ? `${overdue ? 'Fecha pasada' : 'Hasta el'} · ${shortDate(goal.dueDate)}` : 'Objetivo continuo · sin fecha'}</div><div class="goal-progress-info"><span>${goal.targetAmount > 0 ? `${formatMoney(goal.progress)} / ${formatMoney(goal.targetAmount)} Gs` : 'Progreso manual'}</span><strong>${percent}%</strong></div><div class="progress-track" role="progressbar" aria-label="${escape(`Progreso de ${goal.title}`)}" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"><div style="width:${percent}%"></div></div><button class="goal-update" data-action="progress-goal" data-id="${escape(goal.id)}">${goal.done ? 'Revisar objetivo' : 'Actualizar progreso'} ↗</button></article>`;
  }
  function renderGoals() {
    $('goal-list').innerHTML = sortedGoals().map(goal => goalCard(goal, false)).join('') || '<div class="empty">¿Qué te gustaría construir?<br>Agregá tu primer objetivo.</div>';
    $('home-goals').innerHTML = sortedGoals().slice(0, 3).map(goal => goalCard(goal, true)).join('') || '<p class="empty">Tu próximo objetivo te espera en la sección Objetivos.</p>';
  }
  let detailGoalId;
  function tidyNotes(text) {
    const lines = String(text).split('\n').map(line => line.replace(/\s+$/, ''));
    const indents = lines.slice(1).filter(line => line.trim()).map(line => line.match(/^[ \t]*/)[0].length);
    const cut = indents.length ? Math.min(...indents) : 0;
    return lines.map((line, index) => index === 0 ? line : line.slice(Math.min(cut, line.match(/^[ \t]*/)[0].length))).join('\n').trim();
  }
  function openGoal(id) {
    const goal = state.goals.find(item => item.id === id);
    if (!goal) return;
    detailGoalId = id;
    const percent = D.goalProgress(goal);
    const overdue = goal.dueDate && goal.dueDate < D.localDate(new Date()) && !goal.done;
    const notes = tidyNotes(goal.notes || '');
    $('goal-detail-title').textContent = goal.title;
    $('goal-detail-body').innerHTML = `<div class="detail-meta"><span class="category-tag">${escape(categories[goal.category] || goal.category)}</span><span class="${overdue ? 'overdue' : ''}">${goal.done ? '✓ Completado' : goal.dueDate ? `${overdue ? 'Fecha pasada' : 'Hasta el'} · ${shortDate(goal.dueDate)}` : 'Objetivo continuo · sin fecha'}</span></div><div class="goal-progress-info detail-progress"><span>${goal.targetAmount > 0 ? `${formatMoney(goal.progress)} / ${formatMoney(goal.targetAmount)} Gs` : 'Progreso manual'}</span><strong>${percent}%</strong></div><div class="progress-track" role="progressbar" aria-label="${escape(`Progreso de ${goal.title}`)}" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"><div style="width:${percent}%"></div></div><h3 class="detail-notes-title">Notas</h3>${notes ? `<div class="goal-notes">${escape(notes)}</div>` : '<p class="empty">Este objetivo todavía no tiene notas. Tocá «Editar objetivo» para escribirlas.</p>'}`;
    $('goal-detail').showModal();
  }
  function renderNow() {
    const { current, next } = D.currentSchedule(state.schedule, new Date());
    $('now-block').innerHTML = `<h3>${current ? escape(current.title) : 'Un momento libre'}</h3><span class="time-chip">${current ? `${current.start} – ${current.end}` : 'A tu ritmo'}</span><div class="next-block"><small>DESPUÉS</small><p>${next ? `${escape(next.title)} · ${next.start}` : 'No hay más bloques para hoy.'}</p></div>`;
  }
  function renderSchedule() {
    $('day-tabs').innerHTML = D.DAYS.map(day => `<button data-action="schedule-day" data-id="${day}" class="${day === scheduleDay ? 'active' : ''}" aria-pressed="${day === scheduleDay}">${dayNames[day].slice(0, 3)}</button>`).join('');
    $('schedule-day').textContent = dayNames[scheduleDay];
    const minutes = D.plannedMinutes(state.schedule, scheduleDay);
    $('schedule-hours').textContent = `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${minutes % 60} min` : ''} planificadas`;
    $('schedule-list').innerHTML = D.daySchedule(state.schedule, scheduleDay).map(block => `<article class="schedule-row" style="--block-color:${block.color}"><div class="schedule-time">${block.start} – ${block.end}</div><div class="schedule-info"><h3>${escape(block.title)}</h3>${block.suggested ? '<small>Ajuste sugerido · podés editarlo</small>' : ''}</div><div class="row-actions">${iconAction('edit-block', block.id, '✎', `Editar ${block.title}`)}${iconAction('delete-block', block.id, '×', `Eliminar ${block.title}`, true)}</div></article>`).join('') || '<div class="panel empty">Este día está libre. Agregá un bloque para darle espacio a lo importante.</div>';
  }
  function renderNotes() {
    const box = $('notes-text');
    if (document.activeElement !== box && box.value !== state.notes) box.value = state.notes;
  }
  function render() { renderHabits(); renderGoals(); renderSchedule(); renderNow(); renderNotes(); view(); }
  function input(name, label, value, type = 'text', extra = '') {
    return `<label class="field">${label}<input name="${name}" type="${type}" value="${escape(value)}" ${extra}></label>`;
  }
  function openEditor(type, id) {
    editorContext = { type, id };
    $('form-error').textContent = '';
    if (type === 'habit') {
      const habit = state.habits.find(item => item.id === id) || { name: '', emoji: '✨', enabled: true };
      $('editor-title').textContent = id ? 'Editar hábito' : 'Un nuevo hábito';
      $('editor-fields').innerHTML = input('name', 'Nombre', habit.name, 'text', 'required maxlength="500" placeholder="Por ejemplo, leer 10 minutos"') + input('emoji', 'Emoji', habit.emoji, 'text', 'required maxlength="30"') + `<label class="check-label"><input name="enabled" type="checkbox" ${habit.enabled ? 'checked' : ''}> Incluir en mis hábitos diarios</label>`;
    } else if (type === 'goal') {
      const goal = state.goals.find(item => item.id === id) || { title: '', category: 'crecimiento', dueDate: '', targetAmount: 0, notes: '' };
      $('editor-title').textContent = id ? 'Editar objetivo' : 'Un nuevo objetivo';
      $('editor-fields').innerHTML = input('title', 'Nombre', goal.title, 'text', 'required maxlength="500"') + `<div class="field-pair"><label class="field">Categoría<select name="category">${Object.entries(categories).map(([key, label]) => `<option value="${key}" ${goal.category === key ? 'selected' : ''}>${label}</option>`).join('')}</select></label>${input('dueDate', 'Fecha límite (opcional)', goal.dueDate, 'date')}</div><label class="field">¿Cómo querés medirlo?<select name="mode" id="goal-mode"><option value="percent" ${goal.targetAmount === 0 ? 'selected' : ''}>Porcentaje manual</option><option value="amount" ${goal.targetAmount > 0 ? 'selected' : ''}>Dinero cobrado (Gs)</option></select></label><div id="amount-field" ${goal.targetAmount > 0 ? '' : 'hidden'}>${input('targetAmount', 'Meta en Guaraníes, sin puntos', goal.targetAmount || '', 'number', 'min="1" max="1000000000000" step="1"')}</div><label class="field">Notas<textarea name="notes" maxlength="10000">${escape(goal.notes)}</textarea></label>`;
      $('goal-mode').addEventListener('change', event => { $('amount-field').hidden = event.target.value !== 'amount'; });
    } else if (type === 'progress') {
      const goal = state.goals.find(item => item.id === id);
      if (!goal) return;
      $('editor-title').textContent = goal.title;
      $('editor-fields').innerHTML = input('progress', goal.targetAmount > 0 ? 'Total cobrado hasta ahora (Gs), sin puntos' : 'Mi avance (%)', goal.progress, 'number', `required min="0" max="${goal.targetAmount > 0 ? '1000000000000' : '100'}" step="1"`) + `<div class="update-preview">${goal.targetAmount > 0 ? `Meta: ${formatMoney(goal.targetAmount)} Gs. Ingresá el total acumulado, no solo el último cobro.` : 'Registrá tu avance con honestidad. Este valor lo elegís vos.'}</div><label class="check-label"><input type="checkbox" name="done" ${goal.done ? 'checked' : ''}> Marcar el objetivo como completado</label>${goal.notes ? `<details class="suggestions"><summary>Notas de mi plan</summary><p>${escape(goal.notes)}</p></details>` : ''}`;
    } else {
      const block = state.schedule.find(item => item.id === id) || { title: '', start: '08:00', end: '09:00', days: [scheduleDay], color: '#4F7CFF' };
      $('editor-title').textContent = id ? 'Editar bloque' : 'Un nuevo bloque';
      $('editor-fields').innerHTML = input('title', 'Actividad', block.title, 'text', 'required maxlength="500"') + `<div class="field-pair">${input('start', 'Desde', block.start, 'time', 'required')}${input('end', 'Hasta', block.end, 'time', 'required')}</div><span class="field">Días de la semana</span><div class="day-checks">${D.DAYS.map(day => `<label><input type="checkbox" name="days" value="${day}" ${block.days.includes(day) ? 'checked' : ''}>${dayNames[day].slice(0, 3)}</label>`).join('')}</div>${input('color', 'Color', block.color, 'color')}`;
    }
    $('editor').showModal();
  }
  $('editor-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.target);
    const next = copy();
    const { type, id } = editorContext;
    try {
      if (type === 'habit') {
        const habit = { id: id || uid('habit'), name: String(form.get('name')).trim(), emoji: String(form.get('emoji')).trim(), enabled: form.has('enabled') };
        if (!habit.name || !habit.emoji) throw new Error('Completá el nombre y el emoji.');
        if (id) next.habits = next.habits.map(item => item.id === id ? habit : item); else next.habits.push(habit);
      } else if (type === 'goal') {
        const old = next.goals.find(item => item.id === id);
        const amount = form.get('mode') === 'amount' ? Number(form.get('targetAmount')) : 0;
        if (form.get('mode') === 'amount' && (!Number.isInteger(amount) || amount <= 0)) throw new Error('Ingresá una meta mayor a cero, sin decimales.');
        const goal = { id: id || uid('goal'), title: String(form.get('title')).trim(), category: String(form.get('category')), dueDate: String(form.get('dueDate')), targetAmount: amount, notes: String(form.get('notes')).trim(), progress: old && Boolean(old.targetAmount) === Boolean(amount) ? old.progress : 0, done: old?.done ?? false };
        if (!goal.title) throw new Error('El objetivo necesita un nombre.');
        if (id) next.goals = next.goals.map(item => item.id === id ? goal : item); else next.goals.push(goal);
      } else if (type === 'progress') {
        const goal = next.goals.find(item => item.id === id);
        goal.progress = Number(form.get('progress'));
        goal.done = form.has('done');
      } else {
        const block = { id: id || uid('block'), title: String(form.get('title')).trim(), start: String(form.get('start')), end: String(form.get('end')), color: String(form.get('color')), days: form.getAll('days'), suggested: false };
        if (!block.title || !block.days.length) throw new Error('Ingresá un nombre y elegí al menos un día.');
        if (D.toMinutes(block.start) >= D.toMinutes(block.end)) throw new Error('La hora de fin debe ser posterior al inicio.');
        if (D.hasOverlap(block, next.schedule)) throw new Error('Este bloque se superpone con otro en los días elegidos. Ajustá las horas o editá el bloque existente.');
        if (id) next.schedule = next.schedule.map(item => item.id === id ? block : item); else next.schedule.push(block);
      }
      D.validateState(next);
      if (save(next)) $('editor').close();
      else $('form-error').textContent = 'El cambio no se guardó. Revisá el aviso de almacenamiento.';
    } catch (error) { $('form-error').textContent = error.message; }
  });
  document.addEventListener('click', event => {
    const close = event.target.closest('[data-close]');
    if (close) $(close.dataset.close).close();
    if (event.target.closest('[data-backup]')) { $('backup-error').textContent = ''; $('backup').showModal(); }
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const { action, id } = button.dataset;
    if (action === 'schedule-day') { scheduleDay = id; renderSchedule(); return; }
    if (action === 'view-goal') return openGoal(id);
    if (action === 'detail-edit') { $('goal-detail').close(); return openEditor('goal', detailGoalId); }
    if (action === 'detail-progress') { $('goal-detail').close(); return openEditor('progress', detailGoalId); }
    if (action === 'edit-habit') return openEditor('habit', id);
    if (action === 'edit-goal') return openEditor('goal', id);
    if (action === 'progress-goal') return openEditor('progress', id);
    if (action === 'edit-block') return openEditor('block', id);
    const next = copy();
    if (action === 'check-habit') {
      if (selectedDate > D.localDate(new Date())) { notify('Solo podés marcar hábitos de hoy o días pasados.'); return; }
      next.logs[selectedDate] ??= {};
      next.logs[selectedDate][id] = !next.logs[selectedDate][id];
    } else if (action === 'enable-habit') {
      next.habits.find(item => item.id === id).enabled = true;
    } else if (action.startsWith('delete-')) {
      const key = { 'delete-habit': 'habits', 'delete-goal': 'goals', 'delete-block': 'schedule' }[action];
      const item = next[key].find(item => item.id === id);
      if (!confirm(`¿Eliminar «${item.name || item.title}»?${key === 'habits' ? ' También se borran sus checks.' : ''}`)) return;
      next[key] = next[key].filter(item => item.id !== id);
      if (key === 'habits') Object.values(next.logs).forEach(log => { delete log[id]; });
    } else return;
    save(next);
  });
  $('selected-date').value = selectedDate;
  $('selected-date').max = D.localDate(new Date());
  $('selected-date').addEventListener('change', event => {
    if (!D.validDate(event.target.value) || event.target.value > D.localDate(new Date())) { event.target.value = selectedDate; notify('Elegí hoy o un día pasado.'); return; }
    selectedDate = event.target.value;
    renderHabits();
  });

  
  // Agrego esto
  let notesTimer;
function saveNotes() {
  clearTimeout(notesTimer);
  const text = $('notes-text').value;
  if (text === state.notes) return;
  const next = copy();
  next.notes = text;
  $('notes-status').textContent = save(next) ? 'Guardado ✓' : 'No se pudo guardar';
}
$('notes-text').addEventListener('input', () => {
  $('notes-status').textContent = 'Escribiendo…';
  clearTimeout(notesTimer);
  notesTimer = setTimeout(saveNotes, 500);
});
$('notes-text').addEventListener('blur', saveNotes);
window.addEventListener('pagehide', saveNotes);
  //TERMINA esto


  $('add-habit').addEventListener('click', () => openEditor('habit'));
  $('add-goal').addEventListener('click', () => openEditor('goal'));
  $('add-block').addEventListener('click', () => openEditor('block'));
  $('backup-button').addEventListener('click', () => { $('backup-error').textContent = ''; $('backup').showModal(); });
  $('export-data').addEventListener('click', () => {
    try {
      const data = loadBlocked ? localStorage.getItem(STORAGE_KEY) : JSON.stringify(state, null, 2);
      if (!data) throw new Error('No hay datos guardados para recuperar.');
      const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url; link.download = `habitplan-${D.localDate(new Date())}.json`; document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { $('backup-error').textContent = error.message; }
  });
  $('import-data').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('El respaldo supera el límite de 2 MB.');
      const imported = D.validateState(JSON.parse(await file.text()));
      if (!confirm('¿Reemplazar tus datos por este respaldo? Descargá el plan actual primero si querés conservarlo.')) return;
      if (save(imported, true)) { $('backup').close(); notify('Respaldo importado. Tu plan está listo.'); }
      else $('backup-error').textContent = 'No se pudo guardar el respaldo. Los datos anteriores se conservan.';
    } catch (error) { $('backup-error').textContent = error instanceof SyntaxError ? 'No se pudo leer el JSON del respaldo.' : error.message; }
    finally { event.target.value = ''; }
  });
  window.addEventListener('hashchange', view);
  window.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY) return;
    if (!event.newValue) { loadBlocked = true; notify('Los datos se eliminaron desde otra pestaña. Recargá la página antes de continuar.'); return; }
    try { state = D.validateState(JSON.parse(event.newValue)); loadBlocked = false; render(); } catch { loadBlocked = true; notify('Otra pestaña cambió los datos a un formato inválido. Descargá un respaldo antes de continuar.'); }
  });
  setInterval(() => { $('selected-date').max = D.localDate(new Date()); renderNow(); }, 60000);
  $('goal-detail').addEventListener('click', event => {
    const box = event.currentTarget.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) event.currentTarget.close();
  });
  // Horario nuevo: se aplica una sola vez a los datos ya guardados en este navegador.
  // Hábitos, checks, objetivos, progreso y notas no se tocan.
  function migrateSchedule() {
    const versionKey = 'habitplan.schedule.version';
    const version = '2';
    if (loadBlocked) return;
    try {
      if (localStorage.getItem(versionKey) === version) return;
      if (localStorage.getItem(STORAGE_KEY) !== null) {
        const next = copy();
        next.schedule = D.validateState(window.HabitSeed).schedule;
        if (!save(next)) return;
      }
      localStorage.setItem(versionKey, version);
    } catch { /* sin almacenamiento: se usa el horario del seed */ }
  }
  migrateSchedule();
  render();
})();
