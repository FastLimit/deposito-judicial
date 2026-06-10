import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getAuthSession();
  if (!session?.user) {
    return null;
  }
  return session;
}

export async function requireRole(...roles: string[]) {
  const session = await requireAuth();
  if (!session) return null;
  const userRole = (session.user as { role: string }).role;
  if (!roles.includes(userRole)) return null;
  return session;
}
