// eslint-disable-next-line
import NextAuth from 'next-auth';

// types
import type { TenantType, UserRole } from 'types/auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    id: any;
    provider: any;
    token: any;
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
      role?: UserRole;
      tenantType?: TenantType;
      tenantId?: string | null;
      backendUser?: {
        role?: string;
        sectorId?: string;
        sectorType?: string;
        merchantId?: string;
      };
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
    tenantType?: TenantType;
    tenantId?: string | null;
    backendUser?: {
      role?: string;
      sectorId?: string;
      sectorType?: string;
      merchantId?: string;
    };
  }
}
