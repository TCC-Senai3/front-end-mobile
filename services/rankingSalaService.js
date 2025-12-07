// services/rankingSalaService.js
import api from "./api";

/**
 * Busca o ranking final de uma sala específica
 * Endpoint: GET /ranking/sala/{idSala}
 */
export const getRankingSala = async (idSala, token = null) => {
  try {
    const config = {};

    // Se o token for passado, adiciona ao cabeçalho
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }

    const response = await api.get(`/ranking/sala/${idSala}`, config);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao buscar ranking da sala ${idSala}:`, error);
    return []; // Evita travar a tela
  }
};

/**
 * Busca a pontuação total acumulada do usuário
 * Endpoint: GET /ranking/pontuacao
 */
export const getPontuacaoAtual = async (token = null) => {
  try {
    const config = {};

    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }

    const response = await api.get('/ranking/pontuacao', config);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pontuação:", error);
    return 0;
  }
};

const rankingSalaService = {
  getRankingSala,
  getPontuacaoAtual
};

export default rankingSalaService;
