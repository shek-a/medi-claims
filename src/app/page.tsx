'use client';

import Image from "next/image";
import { useAuth, useUser } from "@clerk/nextjs";

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  if (isSignedIn && user) {
    // Welcome page for authenticated users
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-900 mb-8">
              Welcome {user.firstName || user.fullName || "User"}!
            </h1>
            <p className="text-xl text-blue-700 mb-8">
              Ready to review and process medical claims efficiently
            </p>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                  <h3 className="font-medium text-blue-900">View Dashboard</h3>
                  <p className="text-sm text-gray-600">
                    Access claims overview and analytics
                  </p>
                </div>
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

  // Landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Full-Width Image */}
      <div className="relative w-full h-96 md:h-[500px] lg:h-[600px]">
        <Image
          src="/images/medi-claims-home-page-image.png"
          alt="Medical Claims Management for Insurance Professionals"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-blue-900 bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">MediClaims</h1>
            <p className="text-xl md:text-2xl mb-8">
              Professional Claims Management for Insurance Teams
            </p>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Streamline your insurance operations with our comprehensive platform
              designed specifically for insurance company staff to efficiently
              review, process, and manage health claims
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built for Insurance Professionals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides everything your insurance team needs to manage
              health claims efficiently and accurately
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Compliance Ready
              </h3>
              <p className="text-gray-600">
                HIPAA compliant with automated compliance reporting and audit trails
                for regulatory requirements
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Efficient Processing
              </h3>
              <p className="text-gray-600">
                Streamlined workflow tools to review, approve, or deny claims
                quickly with intelligent routing and priority queues
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Advanced Analytics
              </h3>
              <p className="text-gray-600">
                Comprehensive reporting and analytics to track claim volumes,
                processing times, and identify fraud patterns
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Claims Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join leading insurance companies who trust MediClaims for their health
            claims management operations
          </p>
          <div className="space-x-4">
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Request Demo
            </button>
            <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
