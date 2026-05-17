import type { Todo, TodoStatus } from './types';

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.text === 'string' &&
    typeof candidate.completed === 'boolean' &&
    typeof candidate.createdAt === 'string'
  );
}

export function isTodoArray(value: unknown): value is Todo[] {
  return Array.isArray(value) && value.every(isTodo);
}

export function getStatusLabel(todo: Todo): TodoStatus {
  return todo.completed ? 'DONE' : 'ACTIVE';
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return dateFormatter.format(date);
}

export function createId(): string {
  return crypto.randomUUID();
}
