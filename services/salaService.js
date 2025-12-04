// services/salaService.js
import api from "./api";

/**
 * Criar nova sala
 * Backend: POST /salas
 */
export const createSala = async (salaData, token) => {
  try {
    const response = await api.post("/salas", salaData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Erro ao criar sala:", error);
    throw error;
  }
};

/**
 * Obter sala pelo PIN/código.
 * Backend: GET /salas/codigo/{pin}
 * Fallback: GET /salas/{pin}
 */
export const getSalaByPin = async (pin, token) => {
  try {
    const response = await api.get(`/salas/codigo/${pin}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.warn("⚠️ /salas/codigo falhou, tentando fallback /salas/{pin}...");

    try {
      const response = await api.get(`/salas/${pin}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (fallbackError) {
      console.error("❌ Erro ao buscar sala:", fallbackError);
      throw fallbackError;
    }
  }
};

/**
 * Entrar na sala
 * Backend: POST /salas/{idSala}/entrar/{idUsuario}
 */
export const entrarNaSala = async (idSala, idUsuario, token) => {
  try {
    const response = await api.post(
      `/salas/${idSala}/entrar/${idUsuario}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao entrar na sala ${idSala}:`, error);
    throw error;
  }
};

/**
 * Sair da sala
 * Backend: DELETE /salas/{idSala}/sair/{idUsuario}
 */
export const sairDaSala = async (idSala, idUsuario, token) => {
  try {
    const response = await api.delete(
      `/salas/${idSala}/sair/${idUsuario}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Erro ao sair da sala:", error);
    throw error;
  }
};

/**
 * Fechar sala
 * Backend: PUT /salas/{idSala}/fechar
 */
export const fecharSala = async (idSala, token) => {
  try {
    const response = await api.put(
      `/salas/${idSala}/fechar`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Erro ao fechar sala:", error);
    throw error;
  }
};

/**
 * Expulsar usuário
 * Backend: DELETE /salas/{idSala}/expulsar/{idUsuario}
 */
export const expulsarUsuario = async (idSala, idUsuario, token) => {
  try {
    const response = await api.delete(
      `/salas/${idSala}/expulsar/${idUsuario}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Erro ao expulsar usuário:", error);
    throw error;
  }
};

export default {
  createSala,
  getSalaByPin,
  entrarNaSala,
  sairDaSala,
  fecharSala,
  expulsarUsuario,
};
