import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("farmguard_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("farmguard_user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("farmguard_token", token);
    } else {
      localStorage.removeItem("farmguard_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("farmguard_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("farmguard_user");
    }
  }, [user]);

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    login(authPayload) {
      setToken(authPayload.access_token);
      setUser(authPayload.user);
    },
    logout() {
      setToken(null);
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
