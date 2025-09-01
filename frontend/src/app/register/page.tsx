'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Todo List App</h2>
            <p className="mt-2 text-sm text-gray-600">Create your account to get started</p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </AuthProvider>
  );
}
