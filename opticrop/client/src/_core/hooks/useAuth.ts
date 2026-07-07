export function useAuth() {
  // Mock user for local development
  const mockUser = {
    id: 1,
    openId: "local-user",
    email: "user@local.dev",
    name: "Local User",
    loginMethod: "local",
    role: "admin" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user: mockUser,
    loading: false,
    error: null,
    isAuthenticated: true,
    logout: async () => {
      console.log("Logged out");
    },
  };
}

export function getLoginUrl() {
  return `${window.location.origin}/dashboard`;
}
