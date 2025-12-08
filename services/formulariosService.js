// services/formulariosService.js
import api from './api';

/**
 * Busca todos os formulários (questionários)
 * GET /formularios
 */
export async function getQuestionarios(token = null) {
  try {
    const config = {};

    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }

    const response = await api.get('/formularios', config);
    return response.data;

  } catch (error) {
    console.error("❌ Erro ao buscar formulários:", error);
    throw error;
  }
}

/**
 * Busca um formulário específico pelo ID (com perguntas e alternativas)
 * GET /formularios/{id}
 */
export async function getFormularioById(id, token = null) {
  try {
    const config = {};

    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }

    const response = await api.get(`/formularios/${id}`, config);
    return response.data;

  } catch (error) {
    console.error(`❌ Erro ao buscar formulário ${id}:`, error);
    throw error;
  }
}

/**
 * Envia resposta do jogador
 * Backend recebe EXATAMENTE:
 * {
 *   "idUsuario": 0,
 *   "idPergunta": 0,
 *   "idAlternativaSelecionada": 0,
 *   "idSala": 0,
 *   "tempoGasto": 0
 * }
 *
 * POST /respostas
 */
export async function enviarResposta(payload, token = null) {
  try {
    const config = {};

    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }

    // Garante que mandamos SOMENTE o que o backend espera
    const body = {
      idUsuario: payload.idUsuario,
      idPergunta: payload.idPergunta,
      idAlternativaSelecionada: payload.idAlternativaSelecionada,
      idSala: payload.idSala,
      tempoGasto: payload.tempoGasto
    };

    const response = await api.post('/respostas', body, config);
    return response.data;

  } catch (error) {
    console.error("❌ Erro ao enviar resposta:", error);
    throw error;
  }
}

const formulariosService = {
  getQuestionarios,
  getFormularioById,
  enviarResposta,
};

export default formulariosService;
