import api from "./api";
import { User } from "../models";

const authService = {
  /** @returns {Promise<{user: User, token: string}>} */
  async login(credentials) {
    const { data } = await api.post("/user/login", credentials);
    return { user: User.fromApi(data.user), token: data.token };
  },

  register(userData) {
    return api.post("/user", userData);
  },
};

export default authService;
