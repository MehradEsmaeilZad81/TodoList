'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { Dashboard } from '@/components/dashboard/Dashboard';

export default function DashboardPage() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}
