import { ReactNode } from 'react';

// ==============================|| TYPES - AUTH ||============================== //

export type GuardProps = {
  children: ReactNode;
};

export type UserRole = 'SUPER_ADMIN' | 'MERCHANT_ADMIN';

export type TenantType = 'hotel' | 'tourism' | 'barber' | 'clinic';
