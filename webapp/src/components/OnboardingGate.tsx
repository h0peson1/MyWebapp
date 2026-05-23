'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export default function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAllowedPath = useMemo(() => {
    return pathname.startsWith('/onboarding') || pathname.startsWith('/logout');
  }, [pathname]);

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    const key = `onboarding-complete:v1:${user.id}`;
    const complete = localStorage.getItem(key) === 'true';

    if (!complete && !isAllowedPath) {
      router.replace('/onboarding');
    }
  }, [isAllowedPath, loading, router, user]);

  return <>{children}</>;
}
