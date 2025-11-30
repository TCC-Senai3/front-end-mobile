import api from "./api";
import { handleApiErrors } from "../utils/handleApiErrors";

// =============================
// LOGIN DO USUÁRIO
// =============================
export async function loginUsuario(email, senha) {
  try {
    const response = await api.post("/usuarios/login", {
      email,
      senha,
    });

    return response.data; // OK
  } catch (error) {
    throw new Error(handleApiErrors(error));
  }
}

// =============================
// CADASTRO DO USUÁRIO
// =============================
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

// =============================
// BUSCAR AVATAR DO USUÁRIO PELO ID
// =============================
export async function getAvatarById(userId) {
  try {
    const response = await api.get(`/usuarios/${userId}/avatar`);

    // Aqui assumo que sua API retorna:
    // { "avatar": "https://servidor.com/arquivo.png" }
    return response.data.avatar || null;

  } catch (error) {
    console.error(`Erro ao carregar avatar do usuário ${userId}:`, error);
    return null; // Evita crash no ranking
  }
}

// Export único organizado
const usuarioService = {
  loginUsuario,
  cadastrarUsuario,
  getAvatarById,
};

export default usuarioService;
