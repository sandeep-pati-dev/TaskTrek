import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom hook to easily consume the AuthContext session state.
 * @returns {Object} - { user, initializing, login, logout }
 */
export const useAuth = () => useContext(AuthContext);
