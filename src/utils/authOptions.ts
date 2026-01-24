// next
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// third-party
import axiosPlain from 'axios';

// project imports
import axios from 'utils/axios';
import type { TenantType, UserRole } from 'types/auth';



declare module 'next-auth' {
  interface User {
    accessToken?: string;
    role?: UserRole;
    tenantType?: TenantType;
    tenantId?: string;
  }
}

const ROLE_VALUES: UserRole[] = ['SUPER_ADMIN', 'MERCHANT_ADMIN'];
const TENANT_VALUES: TenantType[] = ['hotel', 'tourism', 'barber'];

const coerceRole = (value?: string | null): UserRole | undefined =>
  value && ROLE_VALUES.includes(value as UserRole) ? (value as UserRole) : undefined;

const coerceTenantType = (value?: string | null): TenantType | undefined =>
  value && TENANT_VALUES.includes(value as TenantType) ? (value as TenantType) : undefined;

const decodeJwtPayload = (token: string): Record<string, any> => {
  const part = token.split('.')[1];
  if (!part) return {};
  try {
    return JSON.parse(Buffer.from(part, 'base64').toString('utf-8'));
  } catch {
    try {
      return JSON.parse(Buffer.from(part, 'base64url').toString('utf-8'));
    } catch {
      return {};
    }
  }
};

const extractUserId = (payload: Record<string, any>, fallback?: string) =>
  payload?.sub || payload?.userId || payload?.id || payload?._id || payload?.user?.id || fallback;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET_KEY,
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'login',
      credentials: {
        email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' },
        identifier: { name: 'identifier', label: 'Identifier', type: 'text', placeholder: 'Enter Identifier' }
      },
      async authorize(credentials) {
        try {
          const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');
          const baseNoApi = apiBaseUrl.endsWith('/api') ? apiBaseUrl.slice(0, -4) : apiBaseUrl;
          const loginUrls = Array.from(
            new Set([`${apiBaseUrl}/auth/login`, `${baseNoApi}/auth/login`, `${baseNoApi}/api/auth/login`])
          );

          let response;
          let lastError: unknown;

          for (const url of loginUrls) {
            try {
              response = await axiosPlain.post(url, {
                identifier: credentials?.email || (credentials as any)?.identifier,
                password: credentials?.password
              });
              break;
            } catch (error) {
              lastError = error;
            }
          }

          if (!response) {
            throw lastError || new Error('Login failed');
          }

          const rawPayload = response?.data;
          let payload: any = rawPayload || {};
          if (typeof rawPayload === 'string') {
            try {
              payload = JSON.parse(rawPayload);
            } catch {
              payload = rawPayload;
            }
          }
          const data = payload?.data ?? payload;
          const accessToken =
            data?.access_token ||
            data?.accessToken ||
            payload?.access_token ||
            payload?.accessToken ||
            data?.token ||
            payload?.token ||
            data?.jwt ||
            payload?.jwt;

          if (!accessToken) {
            throw new Error(payload?.message || payload?.error?.message || 'Login failed');
          }

          const tokenPayload = decodeJwtPayload(accessToken);
          const rawUser = data?.user || payload?.user || data?.profile || payload?.profile || data?.account || payload?.account;
          const fallbackUserId = extractUserId(tokenPayload, credentials?.email || (credentials as any)?.identifier);
          const fallbackUser = {
            id: fallbackUserId,
            email: tokenPayload?.email || credentials?.email || (credentials as any)?.identifier
          };
          const user = { ...fallbackUser, ...(rawUser || {}) };

          if (!user?.id) {
            throw new Error(payload?.message || 'Login failed');
          }

          return {
            ...user,
            id: String(user.id),
            accessToken,
            role: coerceRole(user.role) || coerceRole(tokenPayload.role),
            tenantId: tokenPayload.merchantId || tokenPayload.tenantId,
            tenantType: coerceTenantType(tokenPayload.tenantType)
          };
        } catch (e: any) {
          const errorMessage = e?.message || e?.response?.data?.message || 'Something went wrong!';
          throw new Error(errorMessage);
        }
      }
    }),
    CredentialsProvider({
      id: 'register',
      name: 'Register',
      credentials: {
        firstname: { name: 'firstname', label: 'Firstname', type: 'text', placeholder: 'Enter Firstname' },
        lastname: { name: 'lastname', label: 'Lastname', type: 'text', placeholder: 'Enter Lastname' },
        email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
        company: { name: 'company', label: 'Company', type: 'text', placeholder: 'Enter Company' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          const user = await axios.post('/api/account/register', {
            firstName: credentials?.firstname,
            lastName: credentials?.lastname,
            company: credentials?.company,
            password: credentials?.password,
            email: credentials?.email
          });

          if (user) {
           // users.push(user.data);
            return user.data;
          }
        } catch (e: any) {
          const errorMessage = e?.message || e?.response?.data?.message || 'Something went wrong!';
          throw new Error(errorMessage);
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      const fallbackRole: UserRole = 'MERCHANT_ADMIN';
      const fallbackTenantType: TenantType = 'hotel';

      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.provider = account?.provider;
        token.role = coerceRole(user.role) || fallbackRole;
        token.tenantType = coerceTenantType(user.tenantType) || fallbackTenantType;
        token.tenantId = user.tenantId;
      }

      if (!token.role) token.role = fallbackRole;
      if (!token.tenantType) token.tenantType = fallbackTenantType;

      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.provider = token.provider;
        session.token = token;
        session.user = {
          ...session.user,
          role: token.role,
          tenantType: token.tenantType,
          tenantId: token.tenantId
        };
      }
      return session;
    },
    async signIn(params) {
      // Prevent JWT token issuance on registration
      if (params.account?.provider === 'register') {
        return `${process.env.NEXTAUTH_URL}login`;
      }
      return true;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: Number(process.env.NEXT_APP_JWT_TIMEOUT!)
  },
  jwt: {
    secret: process.env.NEXT_APP_JWT_SECRET
  },
  pages: {
    signIn: '/login',
    newUser: '/register'
  }
};
