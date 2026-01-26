'use client';

// next
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// project-imports
import Loader from 'components/Loader';
import { mapAuthUser } from 'utils/auth-mapper';

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

  // session yüklenirken bekle
  if (status === 'loading') {
    return <Loader />;
  }

  // login değilse
  if (!session?.user?.backendUser) {
    router.replace('/login');
    return null;
  }

  const auth = mapAuthUser(session.user.backendUser);

  // role yetkisi yoksa
  if (!allowedRoles.includes(auth.role)) {
    router.replace(fallbackPath);
    return null;
  }

  return <>{children}</>;
}
