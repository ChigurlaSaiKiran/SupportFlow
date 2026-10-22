import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { registerLogoutHandler } from "../auth/authEvents";

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("availabilityStatus");
    setToken(null);
    setUser(null);
  };

  const login = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  useEffect(() => {
    registerLogoutHandler(logout);
  }, []);

  const role = user?.roleName || "";

  const value = useMemo(
    () => ({
      user,
      token,
      role,
      isAuthenticated: Boolean(token),
      isAdmin: role === "Admin",
      isAgent: role === "Agent",
      isUser: role === "User",
      login,
      logout,
      updateUser,
    }),
    [user, token, role]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
