// services/api.js
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

export const API_CONFIG = {
  // URL do seu backend no Azure
  BASE_URL: "https://tccdrakes.azurewebsites.net",
  TIMEOUT: 30000, // 30 segundos de timeout
};

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// --- INTERCEPTOR DE REQUISIÇÃO ---
// Antes de enviar o pedido, pega o token e coloca no cabeçalho
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (token) {
        // Adiciona o header Authorization: Bearer <token>
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
// Se der erro 401 (token inválido/expirado), limpa os dados
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