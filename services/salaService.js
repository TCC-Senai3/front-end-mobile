// services/salaService.js
import api from './api';

/**
 * Cria uma nova sala.
 */
export const createSala = async (salaData) => {
  try {
    const response = await api.post("/salas", salaData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar sala:", error);
    throw error;
  }
};

/**
 * Busca sala pelo PIN/código.
 */
export const getSalaByPin = async (pin) => {
  try {
    // Ajuste a rota se necessário (no seu web estava /salas/codigo/{pin})
    // Se no back for /salas/{pin}, mantenha o anterior. Vou seguir o padrão REST comum.
    // Baseado no seu web:
    const response = await api.get(`/salas/codigo/${pin}`); 
    return response.data;
  } catch (error) {
    // Fallback se a rota for direta
    try {
        const response = await api.get(`/salas/${pin}`);
        return response.data;
    } catch (e) {
        throw error;
    }
  }
};

/**
 * Entrar em uma sala pelo código.
 */
export const entrarNaSala = async (codigoSala, idUsuario) => {
  try {
    const response = await api.post(`/salas/${codigoSala}/entrar/${idUsuario}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao entrar na sala ${codigoSala}:`, error);
    throw error;
  }
};

/**
 * Sair da sala.
 */
export const sairDaSala = async (codigoSala, idUsuario) => {
  try {
    const response = await api.delete(`/salas/${codigoSala}/sair/${idUsuario}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao sair da sala:`, error);
    throw error;
  }
};

/**
 * Fechar sala (apenas dono).
 */
export const fecharSala = async (idSala) => {
  try {
    const response = await api.put(`/salas/${idSala}/fechar`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao fechar sala:`, error);
    throw error;
  }
};

/**
 * Expulsar usuário.
 */
export const expulsarUsuario = async (codigoSala, idUsuarioExpulso) => {
  try {
    const response = await api.delete(`/salas/${codigoSala}/expulsar/${idUsuarioExpulso}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao expulsar usuário:`, error);
    throw error;
  }
};

// Objeto para exportação padrão e nomeada
const salaService = {
  createSala,
  getSalaByPin,
  entrarNaSala,
  sairDaSala,
  fecharSala,
  expulsarUsuario
};

export default salaService;