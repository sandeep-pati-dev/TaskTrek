import api from "./api";

/**
 * Sends a POST request to authenticate the user.
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - User session data { user, token }
 */
export const loginUser = async (credentials) => {
  const res = await api.post("/users/login", credentials);
  return res.data;
};

/**
 * Sends a POST request to register a new user.
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>} - Created user data
 */
export const signupUser = async (userData) => {
  const res = await api.post("/users/signup", userData);
  return res.data;
};
