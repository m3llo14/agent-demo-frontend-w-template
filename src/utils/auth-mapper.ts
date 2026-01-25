// src/utils/auth-mapper.ts
import { TenantType, UserRole } from 'types/auth';
import { resolveTenantType } from 'config/sector-registry';

export const mapAuthUser = (backendUser: any): {
  role: UserRole;
  tenantType?: TenantType;
  merchantId?: string;
} => {
  const rawRole = String(backendUser?.role ?? '').toLowerCase();
  const sectorId = backendUser?.sectorId;
  const sectorType = backendUser?.sectorType;
  const merchantId = backendUser?.merchantId;

  // super admin tenant’sız
  if (rawRole === 'super_admin' || rawRole === 'super-admin' || rawRole === 'superadmin') {
    return { role: 'SUPER_ADMIN' };
  }

  // merchant admin tenant’lı
  if (rawRole === 'admin' || rawRole === 'merchant_admin' || rawRole === 'merchant-admin') {
    return {
      role: 'MERCHANT_ADMIN',
      tenantType: resolveTenantType({ sectorId, sectorType }),
      merchantId
    };
  }

  // fallback: sector varsa merchant, yoksa super admin
  if (sectorId) {
    return {
      role: 'MERCHANT_ADMIN',
      tenantType: resolveTenantType({ sectorId, sectorType }),
      merchantId
    };
  }

  return { role: 'SUPER_ADMIN' };
};
