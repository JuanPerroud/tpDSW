// Persistencia de la sesión (usuario + JWT) en localStorage
const USER_KEY = "user";
const TOKEN_KEY = "token";

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),

  getUser() {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  save(user, token) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (token) localStorage.setItem(TOKEN_KEY, token);
  },

  clear() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },
};
