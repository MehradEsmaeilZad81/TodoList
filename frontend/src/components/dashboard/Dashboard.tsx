'use client';

import React, { useState, useEffect } from 'react';
import { Todo, TodoQueryParams } from '@/types';
import { apiService } from '@/lib/api';
import { TodoItem } from '@/components/todo/TodoItem';
import { CreateTodo } from '@/components/todo/CreateTodo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<TodoQueryParams['sortBy']>('createdAt');
  const [sortOrder, setSortOrder] = useState<TodoQueryParams['sortOrder']>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTodos, setTotalTodos] = useState(0);
  const { logout } = useAuth();
  const router = useRouter();

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        sortBy: sortBy || 'createdAt',
        sortOrder: sortOrder || 'desc',
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await apiService.getTodos(params);
      setTodos(response.data);
      setTotalPages(response.totalPages);
      setTotalTodos(response.total);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy, sortOrder, searchTerm]);

  const handleTodoCreated = (newTodo: Todo) => {
    setTodos(prev => [newTodo, ...prev]);
    setTotalTodos(prev => prev + 1);
  };

  const handleTodoUpdated = (updatedTodo: Todo) => {
    setTodos(prev => prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)));
  };

  const handleTodoDeleted = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    setTotalTodos(prev => prev - 1);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTodos();
  };

  const handleSort = (field: TodoQueryParams['sortBy']) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Todo Dashboard</h1>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSearch} className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search todos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              {(['title', 'description', 'createdAt', 'updatedAt'] as const).map((field) => (
                <Button
                  key={field}
                  variant={sortBy === field ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSort(field)}
                  className="capitalize"
                >
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                  {sortBy === field && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <CreateTodo onTodoCreated={handleTodoCreated} />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading todos...</p>
            </div>
          ) : todos.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No todos found. Create your first todo!</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleTodoUpdated}
                  onDelete={handleTodoDeleted}
                />
              ))}

              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages} ({totalTodos} total todos)
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
