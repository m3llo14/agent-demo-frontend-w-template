'use client';

import { useEffect } from 'react';

// next
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// project-imports
import Loader from 'components/Loader';

// types
import type { UserRole } from 'types/auth';

type RoleGuardProps = {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
};

// ==============================|| ROLE GUARD ||============================== //

export default function RoleGuard({ children, allowedRoles, fallbackPath = '/not-authorized' }: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    const role = session?.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      router.replace(fallbackPath);
    }
  }, [allowedRoles, fallbackPath, router, session, status]);

  if (status === 'loading') return <Loader />;

  const role = session?.user?.role;
  if (!role || !allowedRoles.includes(role)) return <Loader />;

  return <>{children}</>;
}

