export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export type TodoStatus = 'ACTIVE' | 'DONE';

export type NewTodoInput = Pick<Todo, 'text'>;
