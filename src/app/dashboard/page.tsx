'use client';

import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to home if not signed in
  if (!isSignedIn) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-8">
            Dashboard
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-16 max-w-2xl mx-auto">
            <div className="text-gray-500 text-lg">
              Dashboard content coming soon...
            </div>
            <p className="text-gray-400 mt-4">
              This page will contain your claims overview, statistics, and quick actions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}