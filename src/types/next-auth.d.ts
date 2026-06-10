import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    documentNumber: string;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      documentNumber: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    documentNumber: string;
    role: string;
  }
}
