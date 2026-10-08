import api from "./api";

const aiService = {
  /** @returns {Promise<string>} rutina en Markdown */
  async generateRoutine(prompt) {
    const { data } = await api.post("/ai/generate", { prompt });
    return data.generatedRoutine;
  },
};

export default aiService;
