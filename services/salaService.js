// services/salaService.js
import api from "./api";

/**
 * Normaliza ID para evitar erros quando vier como string, null ou undefined
 */
const normalizeId = (val) => {
  const num = Number(val);
  return isNaN(num) ? null : num;
};

/**
 * Criar nova sala
 * Backend: POST /salas
 */
export const createSala = async (salaData, token) => {
  try {
    const response = await api.post("/salas", salaData, {
      headers: { Authorization: `Bearer ${token}` }
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
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data || null;
  } catch (err1) {
    console.warn("⚠️ /salas/codigo falhou, tentando fallback /salas/{pin}…");

    try {
      const response = await api.get(`/salas/${pin}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data || null;
    } catch (err2) {
      console.error("❌ Erro ao buscar sala pelo PIN:", err2);
      return null;
    }
  }
};

/**
 * Entrar na sala
 * Backend: POST /salas/{idSala}/entrar/{idUsuario}
 */
export const entrarNaSala = async (idSala, idUsuario, token) => {
  const sala = normalizeId(idSala);
  const user = normalizeId(idUsuario);

  if (!sala || !user) {
    console.error("❌ entrarNaSala chamado com IDs inválidos:", idSala, idUsuario);
    return null;
  }

  try {
    const response = await api.post(
      `/salas/${sala}/entrar/${user}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao entrar na sala ${sala}:`, error);
    throw error;
  }
};

/**
 * Sair da sala
 * Backend: DELETE /salas/{idSala}/sair/{idUsuario}
 */
export const sairDaSala = async (idSala, idUsuario, token) => {
  const sala = normalizeId(idSala);
  const user = normalizeId(idUsuario);

  if (!sala || !user) {
    console.error("❌ sairDaSala chamado com IDs inválidos:", idSala, idUsuario);
    return null;
  }

  try {
    const response = await api.delete(`/salas/${sala}/sair/${user}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

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
  const sala = normalizeId(idSala);

  if (!sala) {
    console.error("❌ fecharSala chamado com ID inválido:", idSala);
    return null;
  }

  try {
    const response = await api.put(
      `/salas/${sala}/fechar`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
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
  const sala = normalizeId(idSala);
  const user = normalizeId(idUsuario);

  if (!sala || !user) {
    console.error("❌ expulsarUsuario chamado com IDs inválidos:", idSala, idUsuario);
    return null;
  }

  try {
    const response = await api.delete(
      `/salas/${sala}/expulsar/${user}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Erro ao expulsar usuário:", error);
    throw error;
  }
};

/**
 * Iniciar Sala
 * Backend real: PUT /salas/{codigoSala}/iniciar/{idUsuario}
 *
 * ⚠️ Importante:
 * O seu backend usa "codigoSala" e NÃO idSala.
 */
export const iniciarSala = async (codigoSala, idUsuario, token) => {
  const user = normalizeId(idUsuario);

  if (!codigoSala || !user) {
    console.error("❌ iniciarSala chamado com dados inválidos:", codigoSala, idUsuario);
    return null;
  }

  try {
    const response = await api.put(
      `/salas/${codigoSala}/iniciar/${user}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Erro ao iniciar sala:", error);
    throw error;
  }
};

const salaService = {
  createSala,
  getSalaByPin,
  entrarNaSala,
  sairDaSala,
  fecharSala,
  expulsarUsuario,
  iniciarSala,
};

export default salaService;
