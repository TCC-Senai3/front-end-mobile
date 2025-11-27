import api from "./api";
import { handleApiErrors } from "../utils/handleApiErrors";

export async function loginUsuario(email, senha) {
  try {
    const response = await api.post("/usuarios/login", {
      email,
      senha
    });

    return response.data; // retorna token, usuário, etc.
  } catch (error) {
    throw new Error(handleApiErrors(error));
  }
}

export async function cadastrarUsuario(nome, email, senha) {
  try {
    const response = await api.post("/usuarios/cadastro", {
      nome,
      email,
      senha,
    });

    return response.data;
  } catch (error) {
    throw new Error(handleApiErrors(error));
  }
}
