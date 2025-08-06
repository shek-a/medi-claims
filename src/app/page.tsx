'use client';

import { useAuth, useUser } from "@clerk/nextjs";
import WelcomePage from "@/components/WelcomePage";
import LandingPage from "@/components/LandingPage";

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  if (isSignedIn && user) {
    return <WelcomePage />;
  }

  return <LandingPage />;
}
