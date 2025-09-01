'use client';

import React, { useState } from 'react';
import { Todo } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2, Save, X } from 'lucide-react';
import { apiService } from '@/lib/api';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (updatedTodo: Todo) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (title.trim() === '') return;
    
    setLoading(true);
    try {
      const updatedTodo = await apiService.updateTodo(todo.id, { title, description });
      onUpdate(updatedTodo);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(todo.title);
    setDescription(todo.description);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this todo?')) {
      try {
        await apiService.deleteTodo(todo.id);
        onDelete(todo.id);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isEditing) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Todo title"
              className="text-lg font-semibold"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Todo description"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Updated: {formatDate(todo.updatedAt)}
            </span>
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={loading || title.trim() === ''}
              >
                <Save className="w-4 h-4 mr-1" />
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{todo.title}</CardTitle>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-3">{todo.description}</p>
        <div className="text-sm text-gray-500">
          Created: {formatDate(todo.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
}


