'use client';

// next
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

// project-imports
import Loader from 'components/Loader';

// types
import { GuardProps } from 'types/auth';

// ==============================|| GUEST GUARD ||============================== //

export default function GuestGuard({ children }: GuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = Boolean(session?.user?.backendUser);

  // login olmuş kullanıcı guest sayfasına girmesin
  useEffect(() => {
    if (status !== 'loading' && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router, status]);

  // session yüklenirken bekle
  if (status === 'loading') {
    return <Loader />;
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
