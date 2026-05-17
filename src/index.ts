import './style.css';

import {
  StorageError,
  TodoNotFoundError,
  ValidationError,
} from './errors';
import { clearTodos, loadTodos, saveTodos } from './storage';
import {
  addTodo,
  deleteTodo,
  searchTodos,
  toggleTodo,
} from './todoService';
import type { Todo } from './types';
import {
  bindAddForm,
  bindSearch,
  getElement,
  hideError,
  renderTodos,
  showError,
} from './ui';

function bootstrap(): void {
  const listEl = getElement<HTMLUListElement>('#todo-list');
  const formEl = getElement<HTMLFormElement>('#todo-form');
  const inputEl = getElement<HTMLInputElement>('#todo-input');
  const searchEl = getElement<HTMLInputElement>('#todo-search');
  const errorEl = getElement<HTMLDivElement>('#error-banner');
  const counterEl = getElement<HTMLSpanElement>('#todo-counter');

  let todos: Todo[] = [];
  let keyword = '';

  try {
    todos = loadTodos();
  } catch (err) {
    if (err instanceof StorageError) {
      // Storage was corrupted (e.g. someone edited it via DevTools).
      // Reset to a clean slate so the app stays usable.
      clearTodos();
      showError(errorEl, `${err.message}. Starting with an empty list.`);
    } else {
      throw err;
    }
  }

  const render = (): void => {
    const visible = searchTodos(todos, keyword);
    renderTodos(listEl, visible, {
      onToggle: handleToggle,
      onDelete: handleDelete,
    });
    counterEl.textContent = formatCounter(todos);
  };

  const persist = (): void => {
    try {
      saveTodos(todos);
    } catch (err) {
      if (err instanceof StorageError) {
        showError(errorEl, err.message);
        return;
      }
      throw err;
    }
  };

  const handleAdd = (text: string): void => {
    try {
      todos = addTodo(todos, text);
      hideError(errorEl);
      persist();
      render();
    } catch (err) {
      if (err instanceof ValidationError) {
        showError(errorEl, err.message);
        return;
      }
      throw err;
    }
  };

  const handleToggle = (id: string): void => {
    try {
      todos = toggleTodo(todos, id);
      persist();
      render();
    } catch (err) {
      if (err instanceof TodoNotFoundError) {
        showError(errorEl, err.message);
        return;
      }
      throw err;
    }
  };

  const handleDelete = (id: string): void => {
    try {
      todos = deleteTodo(todos, id);
      persist();
      render();
    } catch (err) {
      if (err instanceof TodoNotFoundError) {
        showError(errorEl, err.message);
        return;
      }
      throw err;
    }
  };

  const handleSearch = (value: string): void => {
    keyword = value;
    render();
  };

  bindAddForm(formEl, inputEl, handleAdd);
  bindSearch(searchEl, handleSearch);

  render();
}

function formatCounter(todos: Todo[]): string {
  const total = todos.length;
  const done = todos.filter((todo) => todo.completed).length;
  return `${done} done · ${total - done} active · ${total} total`;
}

bootstrap();
