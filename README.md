# Orbit (Frontend)

![React](https://img.shields.io/badge/React-19-blue.svg) ![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-cyan.svg)

Interface de usuário para o Orbit, uma aplicação de gerenciamento de projetos e anotações.

## ✨ Features

-   **Design Moderno:** Interface escura (Dark Mode) com efeito de fundo "Aurora" animado e elementos "Frosted Glass" (vidro fosco).
-   **Autenticação Completa:** Telas de Login e Cadastro com validação e suporte para entrada com Google.
-   **Gerenciamento de Projetos:** Interface para listar, criar, editar e deletar projetos.
-   **Editor de Notas Avançado:** Utiliza **Blocknote** para uma experiência de edição rich-text inspirada no Obsidian, com suporte a formatação e upload de imagens por colar/arrastar.
-   **Navegação Fluida:** Rotas gerenciadas com `react-router-dom` para uma experiência de Single-Page Application (SPA).
-   **Responsividade:** Layout adaptado para diferentes tamanhos de tela.

## 🛠️ Tecnologias Utilizadas

-   **React 19** com Hooks
-   **Vite:** Build tool de alta performance.
-   **TypeScript:** Para tipagem estática e um código mais robusto.
-   **Tailwind CSS:** Para estilização rápida e customizável.
-   **React Router:** Para o gerenciamento de rotas.
-   **Axios:** Para fazer as requisições à API backend.
-   **Blocknote:** Editor de texto moderno e extensível.
-   **Lucide React:** Biblioteca de ícones.

## ⚙️ Configuração e Instalação

### Pré-requisitos

-   Node.js (versão 18.x ou superior).
-   npm ou yarn.
-   A API do **Orbit (Backend)** deve estar rodando em `http://localhost:8080`.

### Passos para Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd orbit-front
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    ```

3.  **Verifique a URL da API:**
    -   O arquivo `src/services/api.ts` está configurado para se conectar a `http://localhost:8080`. Se o seu backend estiver rodando em uma porta diferente, ajuste este arquivo.

4.  **Execute a Aplicação em Modo de Desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).