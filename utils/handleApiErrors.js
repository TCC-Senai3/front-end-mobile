// utils/handleApiErrors.js
export function handleApiErrors(error) {
  if (error.response) {
    // Erro do backend (status 400–499)
    const data = error.response.data;

    return (
      data?.mensagem ||
      data?.message ||
      data?.error ||
      `Erro ${error.response.status}: Algo deu errado no servidor.`
    );
  }

  if (error.request) {
    return "Não foi possível conectar ao servidor. Verifique sua internet.";
  }

  return "Erro inesperado. Tente novamente.";
}
