import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as loginRequest, register as registerRequest } from "../../api/auth";

const AuthContext = createContext(null);

const TOKEN_KEY = "flowdesk.token";
const USER_KEY = "flowdesk.user";

function loadStoredSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem(USER_KEY);

  return {
    token,
    user: user ? JSON.parse(user) : null,
  };
}

export function AuthProvider({ children }) {
  const [{ token, user }, setSession] = useState(loadStoredSession);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return;
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, [token, user]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === "ADMIN",
      async login(credentials) {
        const response = await loginRequest(credentials);
        const nextUser = {
          id: response.userId,
          username: response.username,
          email: response.email,
          role: response.role,
        };

        setSession({
          token: response.token,
          user: nextUser,
        });

        return nextUser;
      },
      async register(payload) {
        const response = await registerRequest(payload);
        const nextUser = {
          id: response.userId,
          username: response.username,
          email: response.email,
          role: response.role,
        };

        setSession({
          token: response.token,
          user: nextUser,
        });

        return nextUser;
      },
      updateUser(nextUser) {
        setSession((current) => ({ ...current, user: nextUser }));
      },
      logout() {
        setSession({ token: null, user: null });
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
