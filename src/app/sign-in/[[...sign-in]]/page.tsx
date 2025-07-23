import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-blue-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-blue-700">
            Access your medical claims dashboard
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm',
                card: 'shadow-none',
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}