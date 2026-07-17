import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      companyName: string;
      discountPercent: number;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    companyName: string;
    discountPercent: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    companyName: string;
    discountPercent: number;
  }
}
