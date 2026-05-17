export class TodoNotFoundError extends Error {
  constructor(id: string) {
    super(`Todo with id "${id}" was not found`);
    this.name = 'TodoNotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class StorageError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'StorageError';
  }
}
