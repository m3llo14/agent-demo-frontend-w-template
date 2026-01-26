// project-imports
import DashboardLayout from 'layout/DashboardLayout';
import AuthGuard from 'utils/route-guard/AuthGuard';
import RoleGuard from 'utils/route-guard/RoleGuard';

// ==============================|| DASHBOARD LAYOUT ||============================== //

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['SUPER_ADMIN', 'MERCHANT_ADMIN']}>
      <DashboardLayout>{children}</DashboardLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
