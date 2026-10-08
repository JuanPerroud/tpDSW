import api from "./api";
import { Exercise } from "../models";

const exerciseService = {
  /** Ejercicios globales + los privados del usuario autenticado */
  async list() {
    const { data } = await api.get("/exercise");
    return data.map(Exercise.fromApi);
  },

  create(exercise) {
    return api.post("/exercise", exercise);
  },

  update(id, exercise) {
    return api.put(`/exercise/${id}`, exercise);
  },

  remove(id) {
    return api.delete(`/exercise/${id}`);
  },
};

export default exerciseService;
