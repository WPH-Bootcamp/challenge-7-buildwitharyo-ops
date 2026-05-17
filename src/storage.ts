import { StorageError } from './errors';
import type { Todo } from './types';
import { isTodoArray } from './utils';

const STORAGE_KEY = 'todos:v1';

export function loadTodos(): Todo[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new StorageError('Stored todos are not valid JSON', err);
  }

  if (!isTodoArray(parsed)) {
    throw new StorageError('Stored todos do not match the expected shape');
  }

  return parsed;
}

export function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (err) {
    throw new StorageError('Failed to save todos to localStorage', err);
  }
}

export function clearTodos(): void {
  localStorage.removeItem(STORAGE_KEY);
}
