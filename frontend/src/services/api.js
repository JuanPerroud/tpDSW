import axios from "axios";
import { authStorage } from "./authStorage";

// URL base de la API: se configura con VITE_API_URL (ver frontend/.env.example)
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Evento que App.jsx escucha para cerrar la sesión cuando el backend responde 401
export const UNAUTHORIZED_EVENT = "auth:unauthorized";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/user/login");
    if (error.response?.status === 401 && !isLoginRequest) {
      authStorage.clear();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  },
);

// Mensaje legible a partir de un error de Axios
export const getErrorMessage = (error, fallback = "Ocurrió un error inesperado") =>
  error.response?.data?.mensaje || error.response?.data?.error || fallback;

export default api;
