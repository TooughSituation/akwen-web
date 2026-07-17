import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { findDemoUserByEmail } from "@/lib/b2b/seed-users";

/**
 * Auth.js v5 (NextAuth) — logowanie B2B kontami testowymi.
 *
 * Analogia VBA: Application.UserName + hasło z tabeli Użytkownicy.
 * Po zalogowaniu sesja (JWT cookie) = „zalogowany wiersz” w całej aplikacji.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Konto B2B",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Hasło", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "");
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = findDemoUserByEmail(email);
        if (!user || user.password !== password) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.profile.contactPerson,
          companyName: user.profile.companyName,
          discountPercent: user.profile.discountPercent,
        };
      },
    }),
  ],
  pages: {
    signIn: "/b2b/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 dni
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = String(user.id);
        token.companyName = String(user.companyName ?? "");
        token.discountPercent = Number(user.discountPercent ?? 0);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.companyName = String(token.companyName ?? "");
        session.user.discountPercent = Number(token.discountPercent ?? 0);
      }
      return session;
    },
  },
  trustHost: true,
});
