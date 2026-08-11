---
title: "SubMaker — Tradução de Legendas por IA"
date: 2025-01-01
description: "Como configurar o SubMaker para traduzir automaticamente legendas para português usando IA (Gemini, ChatGPT), ideal quando não existem legendas PT disponíveis."
tags: ["submaker", "legendas", "ia", "gemini", "stremio"]
categorias: ["legendas"]
weight: 55
---

O **SubMaker** traduz legendas de qualquer conteúdo usando Inteligência Artificial. É o addon certo para quando não existem legendas em português disponíveis — gera a tradução em tempo real, dentro do próprio Stremio.

---

## Passo 1 — Configurar o SubMaker

1. Abre a [Página de Configuração do SubMaker](https://submaker.elfhosted.com/).

<!-- SCREENSHOT: Página inicial do SubMaker em submaker.elfhosted.com, mostrando os campos de configuração -->

2. **API Key:** Recomenda-se o **Google Gemini** (gratuito e rápido).
   - Clica no link *"Get Gemini API Key"* que aparece na página.
   - Cria a chave em [aistudio.google.com](https://aistudio.google.com) e cola no campo **Gemini API Key**.

<!-- SCREENSHOT: Campo "Gemini API Key" preenchido na página de configuração do SubMaker -->

3. **Source Language (Origem):** Seleciona apenas `English`.

   > Manter apenas inglês como origem evita erros de deteção automática de idioma.

4. **Target Language (Destino):** Seleciona `Portuguese`.

5. Clica em **Install** — o Stremio abre e instala o addon.

<!-- SCREENSHOT: Botão Install do SubMaker antes de clicar -->

---

## Passo 2 — Usar no Stremio

O SubMaker **não mostra a legenda imediatamente**. Funciona por pedido dentro do stream:

1. Abre o filme ou série no Stremio.
2. Abre o seletor de legendas — vês opções com **"Criar [Portuguese]"** na lista.

<!-- SCREENSHOT: Lista de legendas no Stremio mostrando as opções "Criar [Portuguese]" do SubMaker -->

3. **Antes de clicar:** Testa uma legenda em inglês para confirmar qual está sincronizada com o vídeo.
4. Clica em **"Criar [Portuguese]"** correspondente à legenda correta.
5. **Aguarda 20 a 30 segundos** — o sistema está a traduzir.
6. Volta a selecionar a mesma legenda — o texto já aparece em português.

<!-- SCREENSHOT: Legenda traduzida para português a aparecer no player do Stremio -->

> **Se a tradução falhar ou parecer estranha:** Clica **3 vezes rapidamente** na mesma legenda para forçar uma nova tradução.

---

## Links

- [SubMaker (Configuração)](https://submaker.elfhosted.com/)
- [Google AI Studio — Obter Gemini API Key](https://aistudio.google.com)
