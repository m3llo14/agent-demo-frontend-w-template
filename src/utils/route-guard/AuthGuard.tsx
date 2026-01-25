'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from 'components/Loader';
import { GuardProps } from 'types/auth';

export default function AuthGuard({ children }: GuardProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // 🔓 PUBLIC SAYFALAR (GUARD DIŞI)
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password')
  ) {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return <Loader />;
  }

  const isAuthenticated = Boolean(session?.user);
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
