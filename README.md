# Senai Skill Up - Mobile App

**Senai Skill Up** é uma plataforma de gamificação e aprendizado desenvolvida para tornar as aulas do SENAI mais dinâmicas e interativas. O aplicativo permite que alunos respondam a *quizzes* em tempo real, competindo em salas virtuais criadas pelos professores.

---

## 📱 Sobre o Projeto

Este aplicativo foi desenvolvido utilizando **React Native** com **Expo**, focando em performance nativa e uma experiência de usuário fluida. A principal característica é a **sincronização em tempo real** (via WebSocket), garantindo que todos os alunos recebam as perguntas e vejam os resultados simultaneamente.

### ✨ Funcionalidades Principais

* **🔐 Autenticação Segura:** Login, Cadastro e Recuperação de Senha.
* **🎮 Game Lobby (Sala de Espera):** Entrada na sala via PIN e visualização dos colegas entrando em tempo real.
* **⚡ Quiz em Tempo Real:** Sincronização de início de partida e envio de respostas instantâneo.
* **🏆 Rankings:** Placar global e ranking específico por sala/partida.
* **👤 Perfil do Aluno:** Personalização de avatar e histórico de pontuação.
* **🎨 UI/UX Responsiva:** Design adaptativo com animações e feedback visual (ícones personalizados).

---

## 🛠️ Tecnologias Utilizadas

O projeto utiliza uma stack moderna baseada no ecossistema JavaScript:

### Frontend (Mobile)
* **[React Native](https://reactnative.dev/):** Framework principal.
* **[Expo](https://expo.dev/):** Plataforma de desenvolvimento (SDK 50+).
    * **Expo Router:** Navegação baseada em arquivos (File-based routing).
    * **Expo Secure Store:** Armazenamento seguro de tokens JWT.
    * **Expo Font:** Carregamento de fontes personalizadas.
* **[Axios](https://axios-http.com/):** Cliente HTTP para requisições REST.
* **STOMP & WebSocket:** Biblioteca `@stomp/stompjs` para comunicação em tempo real com o servidor.

### Backend (Integração)
* O App consome uma API RESTful hospedada no **Microsoft Azure**.
* Backend desenvolvido em **Java Spring Boot** (inferred).

---

## 📂 Estrutura do Projeto

O projeto segue uma arquitetura limpa, separando a lógica de negócio (Services) da interface (UI), facilitando a manutenção.

```bash
├── app/                  # Telas e Rotas (Expo Router)
│   ├── _layout.js        # Configuração global de navegação
│   ├── index.js          # Entry point
│   ├── login.js          # Tela de Login
│   ├── sala.js           # Lobby com WebSocket
│   └── ...               # Outras telas
│
├── components/           # Componentes Reutilizáveis
│   ├── CustomHeader.js   # Cabeçalho padrão
│   ├── CountdownOverlay.js # Contador regressivo
│   └── icons/            # Ícones SVG convertidos
│
├── services/             # Lógica de Negócios (Service Pattern)
│   ├── api.js            # Configuração do Axios + Interceptors
│   ├── authService.js    # Login e Cadastro
│   ├── salaService.js    # Lógica de entrada/saída de sala
│   └── ...
│
└── assets/               # Imagens e Fontes

Como Executar o Projeto
Siga os passos abaixo para rodar o aplicativo no seu ambiente local.

Pré-requisitos
Node.js instalado.

Gerenciador de pacotes npm ou yarn.

Aplicativo Expo Go instalado no seu celular (Android ou iOS).

Passo a Passo
Clone o repositório:

Bash

git clone [https://github.com/seu-usuario/senai-skill-up.git](https://github.com/seu-usuario/senai-skill-up.git)
cd senai-skill-up
Instale as dependências:

Bash

npm install
# ou
yarn install
Inicie o projeto:

Bash

npx expo start
Teste no Celular:

Abra o app Expo Go no seu celular.

Escaneie o QR Code que aparecerá no terminal.

ou

baixe o app no link: https://www.mediafire.com/file/cn6bcsuvjbtsnba/application-887e4243-e44b-42bd-999d-675a3552c1ff.apk/file

Autores
Desenvolvido como parte do projeto de TCC - Senai.

[Leycon Lima - Rodrigo Toshio] - Desenvolvedor Mobile 
