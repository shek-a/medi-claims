'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { Home, BarChart3 } from 'lucide-react';

export default function Navigation() {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="shadow-md border-b border-gray-200" style={{ backgroundColor: '#1993e2' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/images/medi-claims-logo.png"
                alt="MediClaims Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Links - Only show when signed in */}
          {isSignedIn && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium border border-transparent transition-all duration-200 transform hover:scale-105 hover:shadow-md ${
                    pathname === '/' 
                      ? 'text-white bg-blue-600 border-blue-600' 
                      : 'text-white hover:text-white hover:bg-blue-600 hover:border-blue-600'
                  }`}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium border border-transparent transition-all duration-200 transform hover:scale-105 hover:shadow-md ${
                    pathname === '/dashboard' 
                      ? 'text-white bg-blue-600 border-blue-600' 
                      : 'text-white hover:text-white hover:bg-blue-600 hover:border-blue-600'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* Authentication Buttons */}
          <div className="flex items-center space-x-4">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 border border-blue-600 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-md">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg rounded-lg transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5">
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            ) : (
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Mobile menu - Only show navigation when signed in */}
        {isSignedIn && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link
                href="/"
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium border border-transparent transition-all duration-200 transform hover:scale-105 hover:shadow-md ${
                  pathname === '/' 
                    ? 'text-white bg-blue-600 border-blue-600' 
                    : 'text-white hover:text-white hover:bg-blue-600 hover:border-blue-600'
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
              <Link
                href="/dashboard"
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium border border-transparent transition-all duration-200 transform hover:scale-105 hover:shadow-md ${
                  pathname === '/dashboard' 
                    ? 'text-white bg-blue-600 border-blue-600' 
                    : 'text-white hover:text-white hover:bg-blue-600 hover:border-blue-600'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}