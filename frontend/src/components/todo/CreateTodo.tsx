'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { apiService } from '@/lib/api';
import { Todo } from '@/types';

interface CreateTodoProps {
  onTodoCreated: (todo: Todo) => void;
}

export function CreateTodo({ onTodoCreated }: CreateTodoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') return;

    setLoading(true);
    try {
      const newTodo = await apiService.createTodo({ title, description });
      onTodoCreated(newTodo);
      setTitle('');
      setDescription('');
      setIsExpanded(false);
    } catch (error) {
      console.error('Failed to create todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        className="w-full h-20 border-2 border-dashed border-gray-300 hover:border-gray-400 bg-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
        variant="outline"
      >
        <Plus className="w-6 h-6 mr-2" />
        Add New Todo
      </Button>
    );
  }

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-800">Create New Todo</CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="text-blue-600 hover:text-blue-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-blue-800">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="border-blue-300 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-blue-800">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <Button
              type="submit"
              disabled={loading || title.trim() === ''}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Creating...' : 'Create Todo'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


