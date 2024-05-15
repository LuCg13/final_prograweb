import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Usa el proxy si es necesario
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Error en el interceptor:", error);
    return Promise.reject(error);
  }
);

export const login = (credentials) => api.post("/auth/login", credentials);
export const registro = (userData) => api.post("/auth/registro", userData);

export const obtenerDibujos = () => {
  const token = localStorage.getItem("token");
  return api.get("/dibujos", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const crearDibujo = (dibujoData) =>
  api.post("/dibujos", dibujoData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
export const eliminarDibujo = (dibujoId) => api.delete(`/dibujos/${dibujoId}`);
