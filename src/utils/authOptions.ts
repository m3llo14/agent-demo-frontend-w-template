// next
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// project imports
import axios from 'utils/axios';



declare module 'next-auth' {
  interface User {
    accessToken?: string;
    role?: string;
    tenantType?: string;
    tenantId?: string;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET_KEY,
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'login',
      credentials: {
        email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          console.log("authorized: ", credentials)
          const user = await axios.post('http://localhost:3001/api/account/login', {
            password: credentials?.password,
            email: credentials?.email
          });
          if (user) {
            console.log("user.data: ", user.data)
            user.data.user['accessToken'] = user.data.serviceToken;
            console.log("user.data 2: ", user.data)
            return user.data.user;
          }
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
      const fallbackRole = 'merchant_admin';
      const fallbackTenantType = 'hotel';

      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.provider = account?.provider;
        token.role = user.role || fallbackRole;
        token.tenantType = user.tenantType || fallbackTenantType;
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
