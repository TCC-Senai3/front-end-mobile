// services/rankingService.js
import api from "./api";

// Buscar ranking global
export const getRankingGlobal = async () => {
  try {
    const response = await api.get("/ranking/geral");

    // O backend já devolve um array, então só retornamos direto
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar ranking global:", error);
    throw error;
  }
};
