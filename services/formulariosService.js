// services/formulariosService.js

import api from './api';

/**
 * Busca todos os formulários (Questionários)
 * Endpoint: GET /formularios
 */
export async function getQuestionarios(token = null) {
  try {
    const config = {};
    // Se o token for passado explicitamente, adiciona ao header
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }

    const response = await api.get('/formularios', config);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar formulários:", error);
    throw error;
  }
}

/**
 * Busca um formulário específico pelo ID (com perguntas e alternativas)
 * Endpoint: GET /formularios/{id}
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
    console.error(`Erro ao buscar formulário ${id}:`, error);
    throw error;
  }
}

// Exporta como objeto padrão e funções individuais
const formulariosService = {
  getQuestionarios,
  getFormularioById,
};

export default formulariosService;