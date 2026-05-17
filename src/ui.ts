import type { Todo } from './types';
import { formatDateTime, getStatusLabel } from './utils';

export interface TodoHandlers {
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function getElement<T extends Element>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) {
    throw new Error(`Element not found for selector: ${selector}`);
  }
  return el;
}

export function renderTodos(
  listEl: HTMLElement,
  todos: Todo[],
  handlers: TodoHandlers,
): void {
  listEl.replaceChildren();

  if (todos.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'text-slate-400 italic py-6 text-center';
    empty.textContent = 'No todos yet. Add one to get started.';
    listEl.appendChild(empty);
    return;
  }

  todos.forEach((todo, index) => {
    listEl.appendChild(buildTodoItem(todo, index + 1, handlers));
  });
}

function buildTodoItem(
  todo: Todo,
  position: number,
  handlers: TodoHandlers,
): HTMLLIElement {
  const status = getStatusLabel(todo);
  const item = document.createElement('li');
  item.className =
    'flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg bg-white hover:border-slate-300 transition-colors';
  item.dataset.id = todo.id;

  const badge = document.createElement('span');
  badge.className =
    status === 'DONE'
      ? 'inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-100 text-emerald-700'
      : 'inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold bg-sky-100 text-sky-700';
  badge.textContent = `[${status}]`;

  const number = document.createElement('span');
  number.className = 'font-mono text-sm text-slate-500 tabular-nums';
  number.textContent = `${position}.`;

  const text = document.createElement('span');
  text.className = todo.completed
    ? 'flex-1 text-slate-400 line-through'
    : 'flex-1 text-slate-800';
  text.textContent = todo.text;

  const meta = document.createElement('span');
  meta.className = 'hidden sm:inline text-xs text-slate-400';
  meta.textContent = formatDateTime(todo.createdAt);

  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.className =
    'px-3 py-1 text-sm rounded border border-slate-200 text-slate-700 hover:bg-slate-100';
  toggleBtn.textContent = todo.completed ? 'Undo' : 'Done';
  toggleBtn.addEventListener('click', () => handlers.onToggle(todo.id));

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className =
    'px-3 py-1 text-sm rounded border border-rose-200 text-rose-600 hover:bg-rose-50';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => handlers.onDelete(todo.id));

  item.append(badge, number, text, meta, toggleBtn, deleteBtn);
  return item;
}

export function bindAddForm(
  formEl: HTMLFormElement,
  inputEl: HTMLInputElement,
  onAdd: (text: string) => void,
): void {
  formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    onAdd(inputEl.value);
    inputEl.value = '';
    inputEl.focus();
  });
}

export function bindSearch(
  inputEl: HTMLInputElement,
  onSearch: (keyword: string) => void,
): void {
  inputEl.addEventListener('input', () => {
    onSearch(inputEl.value);
  });
}

export function showError(bannerEl: HTMLElement, message: string): void {
  bannerEl.textContent = message;
  bannerEl.classList.remove('hidden');

  window.setTimeout(() => {
    if (bannerEl.textContent === message) {
      hideError(bannerEl);
    }
  }, 3500);
}

export function hideError(bannerEl: HTMLElement): void {
  bannerEl.textContent = '';
  bannerEl.classList.add('hidden');
}
