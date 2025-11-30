import api from './api';

// Listar todos os formulários (MOBILE)
export const getFormularios = async () => {
  try {
    const response = await api.get('/formularios'); // STRING normal
    return response.data;
  } catch (error) {
    console.error("Erro ao listar formulários:", error);
    throw error; // Repassa o erro para o componente tratar
  }
};
