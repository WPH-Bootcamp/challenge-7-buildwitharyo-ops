import { TodoNotFoundError, ValidationError } from './errors';
import type { Todo } from './types';
import { createId, isNonEmptyString } from './utils';

export function addTodo(todos: Todo[], text: string): Todo[] {
  const trimmed = text.trim();
  if (!isNonEmptyString(trimmed)) {
    throw new ValidationError('Todo text cannot be empty');
  }

  const newTodo: Todo = {
    id: createId(),
    text: trimmed,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  return [...todos, newTodo];
}

export function toggleTodo(todos: Todo[], id: string): Todo[] {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    throw new TodoNotFoundError(id);
  }

  const target = todos[index];
  if (!target) throw new TodoNotFoundError(id);

  const updated: Todo = { ...target, completed: !target.completed };
  return [...todos.slice(0, index), updated, ...todos.slice(index + 1)];
}

export function deleteTodo(todos: Todo[], id: string): Todo[] {
  const exists = todos.some((todo) => todo.id === id);
  if (!exists) {
    throw new TodoNotFoundError(id);
  }

  return todos.filter((todo) => todo.id !== id);
}

export function searchTodos(todos: Todo[], keyword: string): Todo[] {
  const needle = keyword.trim().toLowerCase();
  if (needle.length === 0) return todos;
  return todos.filter((todo) => todo.text.toLowerCase().includes(needle));
}
