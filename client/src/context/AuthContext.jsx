import { createContext, useState, useEffect } from "react";
import { getUser, setUser as saveUser, removeUser } from "../utils/token";

// 1. Create context
export const AuthContext = createContext();

// 2. Provide context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const restoredUser = getUser();
    if (restoredUser) {
      setUser(restoredUser);
    }
    setInitializing(false);
  }, []);

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
