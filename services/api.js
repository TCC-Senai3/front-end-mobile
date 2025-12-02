// services/api.js

import axios from "axios";
import * as SecureStore from 'expo-secure-store'; // Importante: Usar SecureStore aqui também

export const API_CONFIG = {
  BASE_URL: "https://tccdrakes.azurewebsites.net", // Garanta que não tem a barra '/' no final se for concatenar depois
  TIMEOUT: 30000,
};

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// --- INTERCEPTOR DE REQUISIÇÃO (A MÁGICA ACONTECE AQUI) ---
// Antes de enviar o pedido, ele vai no cofre do celular, pega o token e cola no cabeçalho.
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Erro ao recuperar token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- INTERCEPTOR DE RESPOSTA ---
// Se o token estiver vencido (Erro 401), ele limpa o cofre para forçar um novo login.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("authToken");
      await SecureStore.deleteItemAsync("currentUser");
    }
    return Promise.reject(error);
  }
);

export default api;