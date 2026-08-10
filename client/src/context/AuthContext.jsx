import { createContext, useState } from "react";
import { getUser, setUser as saveUser, removeUser } from "../utils/token";

// 1. Create context
export const AuthContext = createContext();

// 2. Provide context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return getUser() || null;
  });
  const [initializing] = useState(false);

  // Login function
  const login = (userData) => {
    setUser(userData);
    saveUser(userData);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    removeUser();
  };

  return (
    <AuthContext.Provider value={{ user, initializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
