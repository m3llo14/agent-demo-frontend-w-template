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
  const isPublicPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password');
  const isAuthenticated = Boolean(session?.user);

  useEffect(() => {
    if (!isPublicPage && status !== 'loading' && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isPublicPage, router, status]);

  // 🔓 PUBLIC SAYFALAR (GUARD DIŞI)
  if (isPublicPage) {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
