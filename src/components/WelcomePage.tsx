'use client';

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const { user } = useUser();
  const router = useRouter();

  const handleViewDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-8">
            Welcome {user?.firstName || user?.fullName || "User"}!
          </h1>
          <p className="text-xl text-blue-700 mb-8">
            Ready to review and process medical claims efficiently
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleViewDashboard}
                className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <h3 className="font-medium text-blue-900">View Dashboard</h3>
                <p className="text-sm text-gray-600">
                  Access claims overview and analytics
                </p>
              </button>
              <div className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                <h3 className="font-medium text-blue-900">Pending Claims</h3>
                <p className="text-sm text-gray-600">
                  Review claims awaiting approval
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
