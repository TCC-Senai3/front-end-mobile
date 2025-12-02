// services/usuarioService.js

import api from "./api";
import * as SecureStore from 'expo-secure-store';

const handleErrors = (error) => {
  return error.response?.data?.message || error.message || "Erro desconhecido";
};

// LOGIN
export async function loginUsuario(email, senha) {
  try {
    const response = await api.post("/usuarios/login", { email, senha });

    if (response.data.token) {
      await SecureStore.setItemAsync('authToken', response.data.token);
      if (response.data.user) {
        await SecureStore.setItemAsync('currentUser', JSON.stringify(response.data.user));
      }
    }
    return response.data; 
  } catch (error) {
    throw new Error(handleErrors(error));
  }
}

// CADASTRO
export async function cadastrarUsuario(nome, email, senha) {
  try {
    const response = await api.post("/usuarios/cadastro", { nome, email, senha });
    return response.data;
  } catch (error) {
    throw new Error(handleErrors(error));
  }
}

// PERFIL
export async function getMeuPerfil() {
  try {
    const response = await api.get("/usuarios/me");
    return response.data;
  } catch (error) {
    throw new Error(handleErrors(error));
  }
}

// LOGOUT
export async function logoutUsuario() {
  try {
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('currentUser');
  } catch (error) {
    console.error("Erro no logout:", error);
  }
}

// TOKEN
export async function getToken() {
  try {
    return await SecureStore.getItemAsync('authToken');
  } catch (error) {
    return null;
  }
}

// AVATAR
export async function getAvatarById(userId) {
  try {
    const response = await api.get(`/usuarios/${userId}/avatar`);
    return response.data.avatar || null;
  } catch (error) {
    return null; 
  }
}

const usuarioService = {
  loginUsuario,
  cadastrarUsuario,
  getMeuPerfil,
  logoutUsuario,
  getToken,
  getAvatarById,
};

export default usuarioService;