import api from "./api";
import { User } from "../models";

const userService = {
  async list(search) {
    const { data } = await api.get("/user", { params: search ? { search } : {} });
    return data.map(User.fromApi);
  },

  async update(id, payload) {
    const { data } = await api.put(`/user/${id}`, payload);
    return User.fromApi(data.user);
  },

  toggleActive(id) {
    return api.patch(`/user/${id}/toggle-active`);
  },

  remove(id) {
    return api.delete(`/user/${id}`);
  },
};

export default userService;
