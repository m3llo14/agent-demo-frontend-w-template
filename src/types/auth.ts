import { ReactNode } from 'react';

// ==============================|| TYPES - AUTH  ||============================== //

export type GuardProps = {
  children: ReactNode;
};

export type UserRole = 'super_admin' | 'merchant_admin';

export type TenantType = 'hotel' | 'tourism';
