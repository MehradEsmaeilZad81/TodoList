import { AuthRequest, AuthResponse, CreateTodoRequest, UpdateTodoRequest, TodoListResponse, Todo, ApiError } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'An error occurred');
    }
    return response.json();
  }

  // Authentication
  async register(data: AuthRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async login(data: AuthRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  // Todo operations
  async createTodo(data: CreateTodoRequest): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Todo>(response);
  }

  async getTodos(params: URLSearchParams): Promise<TodoListResponse> {
    const response = await fetch(`${API_BASE_URL}/todos?${params.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<TodoListResponse>(response);
  }

  async getTodo(id: number): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Todo>(response);
  }

  async updateTodo(id: number, data: UpdateTodoRequest): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Todo>(response);
  }

  async deleteTodo(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ message: string }>(response);
  }
}

export const apiService = new ApiService();


