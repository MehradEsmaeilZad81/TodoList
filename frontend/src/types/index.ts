export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoRequest {
  title: string;
  description: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
}

export interface TodoQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'title' | 'description' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface TodoListResponse {
  data: Todo[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AuthRequest {
  name?: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}


