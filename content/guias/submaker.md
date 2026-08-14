---
title: "SubMaker: Tradução de Legendas por IA"
date: 2025-01-01
description: "Como configurar o SubMaker para traduzir automaticamente legendas para português usando IA (Gemini, ChatGPT), ideal quando não existem legendas PT disponíveis."
tags: ["submaker", "legendas", "ia", "gemini", "stremio"]
categorias: ["legendas"]
weight: 7
tempo: "5 min"
---

O **SubMaker** traduz legendas de qualquer conteúdo usando Inteligência Artificial. É o addon certo para quando não existem legendas em português disponíveis. Gera a tradução em tempo real, dentro do próprio Stremio.

**Tempo estimado: 5 min**

{{< callout type="warning" >}}
**Antes de começares:** Precisas de uma API Key gratuita do Google Gemini. O link para a criares está directamente na página de configuração do SubMaker.
{{< /callout >}}

---

## Passo 1: Configurar o SubMaker

1. Abre a [Página de Configuração do SubMaker](https://submaker.elfhosted.com/).

{{< img src="/images/submaker-configure.png" alt="Página de configuração do SubMaker com os campos de API Key e idiomas" >}}

2. **API Key:** Recomenda-se o **Google Gemini** (gratuito e rápido).
   - Clica no link *"Get Gemini API Key"* que aparece na página.
   - Cria a chave em [aistudio.google.com](https://aistudio.google.com) e cola no campo **Gemini API Key**.

3. **Source Language (Origem):** Seleciona apenas `English`.

   > Manter apenas inglês como origem evita erros de deteção automática de idioma.

4. **Target Language (Destino):** Seleciona `Portuguese`.

5. Clica em **Install**. O Stremio abre e instala o addon.

---

## Passo 2: Usar no Stremio

O SubMaker **não mostra a legenda imediatamente**. Funciona por pedido dentro do stream:

1. Abre o filme ou série no Stremio.
2. Abre o seletor de legendas. Vês opções com **"Criar [Portuguese]"** na lista.
3. **Antes de clicar:** Testa uma legenda em inglês para confirmar qual está sincronizada com o vídeo.
4. Clica em **"Criar [Portuguese]"** correspondente à legenda correta.
5. **Aguarda 20 a 30 segundos**. O sistema está a traduzir.
6. Volta a selecionar a mesma legenda. O texto já aparece em português.

{{< callout type="info" >}}
**Se a tradução falhar ou parecer estranha:** Clica **3 vezes rapidamente** na mesma legenda para forçar uma nova tradução.
{{< /callout >}}

---

## Se algo correr mal

**Opção "Criar [Portuguese]" não aparece**. O SubMaker pode não estar instalado correctamente. Volta à página de configuração e clica em Install de novo.

**A legenda demora mais de 1 minuto**. A API do Gemini pode estar lenta. Aguarda ou clica 3 vezes para forçar nova tentativa.

**Legenda dessincronizada**. O SubMaker traduz a legenda que escolheste, mas a sincronização depende do ficheiro original. Testa outra legenda em inglês até encontrar a que está bem sincronizada, e depois clica em "Criar [Portuguese]" nessa.

---

## Próximo passo

Para títulos e sinopses em português (não só legendas):

→ [Toast Translator: sinopses e ratings em PT](/guias/toast-translator)

---

## Links

- [SubMaker (Configuração)](https://submaker.elfhosted.com/)
- [Google AI Studio: obter Gemini API Key](https://aistudio.google.com)
