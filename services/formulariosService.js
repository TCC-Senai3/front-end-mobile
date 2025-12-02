// services/formulariosService.js

import api from './api';

// Busca todos os formulários
export async function getQuestionarios() {
  try {
    // GET https://tccdrakes.azurewebsites.net/formularios
    // O token é enviado automaticamente pelo interceptor do api.js
    const response = await api.get('/formularios');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar formulários:", error);
    throw error;
  }
}

// Se precisar buscar um específico depois (exemplo)
export async function getQuestionarioById(id) {
  try {
    const response = await api.get(`/formularios/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}