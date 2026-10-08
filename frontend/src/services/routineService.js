import api from "./api";
import { Routine } from "../models";

const routineService = {
  async list() {
    const { data } = await api.get("/routine");
    return data.map(Routine.fromApi);
  },

  /** Detalle: rutina + ejercicios + series + creador */
  async getById(id) {
    const { data } = await api.get(`/routine/${id}`);
    return Routine.fromApi(data);
  },

  create(routine) {
    return api.post("/routine", routine);
  },

  update(id, routine) {
    return api.put(`/routine/${id}`, routine);
  },

  remove(id) {
    return api.delete(`/routine/${id}`);
  },
};

export default routineService;
