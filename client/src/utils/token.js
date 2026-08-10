/**
 * Utility helpers to safely manage user session data in localStorage.
 */

const USER_KEY = "user";

export const getUser = () => {
  try {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (err) {
    console.error("Error reading session from localStorage:", err);
    return null;
  }
};

export const setUser = (userData) => {
  try {
    if (!userData) return;
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  } catch (err) {
    console.error("Error writing session to localStorage:", err);
  }
};

export const removeUser = () => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (err) {
    console.error("Error removing session from localStorage:", err);
  }
};

export const getToken = () => {
  const session = getUser();
  return session?.token || null;
};
