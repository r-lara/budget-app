import NextAuth from 'next-auth';
import bcrypt from 'bcryptjs';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UsersService } from '../lib/services/usersService';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, _req) {
        if (!credentials?.username) {
          return null;
        }
        const user = await UsersService.getUser(credentials.username);
        if (!user) {
          console.log('User not found')
          return null;
        }
        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
        if (passwordsMatch) {
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async redirect({baseUrl}) {
      return `${baseUrl}/`
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login/signIn'
  }
};

export default NextAuth(authOptions);