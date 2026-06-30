/**
 * Authentication Helper Utilities
 */

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
}

export interface UserSession {
  user: SessionUser;
  expires: string;
}

export async function getSession(): Promise<UserSession | null> {
  // Skeleton helper to get active session
  return {
    user: {
      id: "1",
      name: "Admin User",
      email: "admin@cmsbuilder.com",
      role: "Admin",
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

export async function hasRole(role: "Admin" | "Editor" | "Viewer"): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;
  
  const roles = {
    Admin: 3,
    Editor: 2,
    Viewer: 1,
  };
  
  return roles[session.user.role] >= roles[role];
}
