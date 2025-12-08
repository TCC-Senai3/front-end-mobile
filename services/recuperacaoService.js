import api from "./api";

/**
 * Envia email para recuperar senha
 * Backend recebe via @RequestParam
 * Exemplo: POST /senha/esqueceu?email=usuario@gmail.com
 */
export const enviarEmailRecuperacao = async (email) => {
  try {
    console.log("📤 Enviando email para recuperação:", email);

    const response = await api.post(`/senha/esqueceu?email=${encodeURIComponent(email)}`);
    return response.data;

  } catch (error) {
    console.error("❌ Erro ao enviar email de recuperação:", error);
    throw error;
  }
};

/**
 * Redefine a senha
 * Backend recebe @RequestParam token + newPassword
 * Exemplo: POST /senha/reset?token=XYZ&newPassword=abc123
 */
export const redefinirSenha = async (token, novaSenha) => {
  try {
    console.log("📤 Enviando nova senha...");

    const response = await api.post(
      `/senha/reset?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(novaSenha)}`
    );

    return response.data;

  } catch (error) {
    console.error("❌ Erro ao redefinir senha:", error);
    throw error;
  }
};

export default {
  enviarEmailRecuperacao,
  redefinirSenha
};
