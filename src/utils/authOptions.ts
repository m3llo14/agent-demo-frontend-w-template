// next
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// third-party
import axiosPlain from 'axios';

// ==============================
// TYPE AUGMENTATION
// ==============================
declare module 'next-auth' {
  interface User {
    id?: string;
    accessToken?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    backendUser?: {
      role?: string;
      sectorId?: string;
      sectorType?: string;
      merchantId?: string;
    };
  }

  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
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
    accessToken?: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    backendUser?: {
      role?: string;
      sectorId?: string;
      sectorType?: string;
      merchantId?: string;
    };
  }
}

// ==============================
// HELPERS
// ==============================
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
  payload?.sub ||
  payload?.userId ||
  payload?.id ||
  payload?._id ||
  payload?.user?.id ||
  fallback;

// ==============================
// AUTH OPTIONS
// ==============================
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },

      async authorize(credentials) {
        try {
          const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');
          const response = await axiosPlain.post(`${apiBaseUrl}/auth/login`, {
            identifier: credentials?.email,
            password: credentials?.password
          });

          const payload = response.data?.data ?? response.data;
          const accessToken =
            payload?.access_token ||
            payload?.accessToken ||
            payload?.token ||
            payload?.jwt;

          if (!accessToken) {
            throw new Error('Login failed');
          }

          const tokenPayload = decodeJwtPayload(accessToken);
          const rawUser = payload?.user ?? {};
          const userId = extractUserId(tokenPayload, credentials?.email);

          const fullName = [rawUser?.firstname, rawUser?.lastname].filter(Boolean).join(' ').trim();
          const tokenEmail = tokenPayload?.email;
          const resolvedEmail = rawUser?.email || credentials?.email || tokenEmail || null;
          const fallbackName = resolvedEmail ? String(resolvedEmail).split('@')[0] : null;

          return {
            id: String(userId),
            accessToken,
            name: fullName || rawUser?.name || fallbackName,
            email: resolvedEmail,
            image: rawUser?.avatar || rawUser?.image || null,
            backendUser: {
              role: rawUser.role ?? tokenPayload.role,
              sectorId: tokenPayload.sectorId,
              sectorType: tokenPayload.sectorType,
              merchantId: tokenPayload.merchantId
            }
          };
        } catch (e: any) {
          throw new Error(e?.message || 'Login failed');
        }
      }
    })
  ],

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.accessToken = user.accessToken;
        token.backendUser = user.backendUser;
        token.name = user.name ?? token.name;
        token.email = user.email ?? token.email;
        token.picture = user.image ?? token.picture;
      }
      return token;
    },

    session: ({ session, token }) => {
      session.user = {
        ...(session.user ?? {}),
        accessToken: token.accessToken,
        name: (token as any).name ?? session.user?.name ?? null,
        email: (token as any).email ?? session.user?.email ?? null,
        image: (token as any).picture ?? session.user?.image ?? null,
        backendUser: token.backendUser
      };
      return session;
    }
  },

  session: {
    strategy: 'jwt'
  },

  pages: {
    signIn: '/login'
  }
};
