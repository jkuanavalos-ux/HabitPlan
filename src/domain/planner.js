(function (root) {
  'use strict';
  const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  function localDate(date) {
    if (Number.isNaN(date.getTime())) throw new Error('Fecha inválida');
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function validDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T12:00:00`);
    return !Number.isNaN(date.getTime()) && localDate(date) === value;
  }
  function dayCode(date) { return DAYS[(date.getDay() + 6) % 7]; }
  function toMinutes(time) {
    if (typeof time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('Hora inválida');
    const [hour, minute] = time.split(':').map(Number);
    return hour * 60 + minute;
  }
  function dailyProgress(habits, logs, date) {
    const enabled = habits.filter(habit => habit.enabled);
    const done = enabled.filter(habit => logs[date]?.[habit.id] === true).length;
    return { done, total: enabled.length, percent: enabled.length ? Math.round(done / enabled.length * 100) : 0 };
  }
  function goalProgress(goal) {
    if (goal.done) return 100;
    return Math.round(Math.min(100, Math.max(0, goal.targetAmount > 0 ? goal.progress / goal.targetAmount * 100 : goal.progress)));
  }
  function daySchedule(blocks, day) {
    return blocks.filter(block => block.days.includes(day)).sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
  }
  function plannedMinutes(blocks, day) { return daySchedule(blocks, day).reduce((total, block) => total + toMinutes(block.end) - toMinutes(block.start), 0); }
  function currentSchedule(blocks, date) {
    const sorted = daySchedule(blocks, dayCode(date));
    const now = date.getHours() * 60 + date.getMinutes();
    return { current: sorted.find(block => toMinutes(block.start) <= now && now < toMinutes(block.end)), next: sorted.find(block => toMinutes(block.start) > now) };
  }
  function hasOverlap(block, blocks) {
    return blocks.some(other => other.id !== block.id && other.days.some(day => block.days.includes(day)) && toMinutes(block.start) < toMinutes(other.end) && toMinutes(other.start) < toMinutes(block.end));
  }
  function validateState(input) {
    const fail = () => { throw new Error('El respaldo no tiene un formato válido de HabitPlan.'); };
    if (!input || typeof input !== 'object' || input.version !== 1) fail();
    const string = (value, max = 500, empty = false) => typeof value === 'string' && value.length <= max && (empty || value.trim().length > 0);
    const number = (value, max = 1e12) => Number.isFinite(value) && value >= 0 && value <= max;
    const id = value => typeof value === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(value) && !['__proto__', 'constructor', 'prototype'].includes(value);
    for (const key of ['habits', 'goals', 'schedule']) {
      if (!Array.isArray(input[key]) || input[key].length > 1000 || input[key].some(item => !item || !id(item.id)) || new Set(input[key].map(item => item.id)).size !== input[key].length) fail();
    }
    for (const habit of input.habits) if (!string(habit.name) || !string(habit.emoji, 30) || typeof habit.enabled !== 'boolean') fail();
    for (const goal of input.goals) {
      if (!string(goal.title) || !string(goal.category, 40) || !string(goal.notes, 10000, true) || !(goal.dueDate === '' || validDate(goal.dueDate)) || !number(goal.targetAmount) || !number(goal.progress, goal.targetAmount > 0 ? 1e12 : 100) || typeof goal.done !== 'boolean') fail();
      if (goal.targetAmount > 0 && (!Number.isInteger(goal.targetAmount) || !Number.isInteger(goal.progress))) fail();
    }
    for (const block of input.schedule) {
      if (!string(block.title) || !Array.isArray(block.days) || !block.days.length || block.days.some(day => !DAYS.includes(day)) || new Set(block.days).size !== block.days.length || typeof block.color !== 'string' || !/^#[\da-f]{6}$/i.test(block.color) || typeof block.suggested !== 'boolean') fail();
      try { if (toMinutes(block.end) <= toMinutes(block.start)) fail(); } catch { fail(); }
    }
    if (input.schedule.some(block => hasOverlap(block, input.schedule))) fail();
    if (!input.logs || typeof input.logs !== 'object' || Array.isArray(input.logs)) fail();
    for (const [date, log] of Object.entries(input.logs)) {
      if (!validDate(date) || !log || typeof log !== 'object' || Array.isArray(log)) fail();
      if (Object.entries(log).some(([habitId, done]) => !id(habitId) || typeof done !== 'boolean')) fail();
    }
    return JSON.parse(JSON.stringify({ version: 1, habits: input.habits, goals: input.goals, schedule: input.schedule, logs: input.logs }));
  }
  const api = { DAYS, localDate, validDate, dayCode, toMinutes, dailyProgress, goalProgress, daySchedule, plannedMinutes, currentSchedule, hasOverlap, validateState };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HabitDomain = api;
})(typeof window === 'object' ? window : globalThis);
