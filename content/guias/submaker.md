---
title: "SubMaker: Tradução de Legendas por IA"
date: 2025-01-01
description: "O SubMaker traduz legendas para português automaticamente, já configurado pelo QuickStart PT sem precisares de nenhuma chave API. Este guia explica como usar, e como mudar para o Gemini se quiseres traduções mais naturais."
tags: ["submaker", "legendas", "ia", "gemini", "stremio"]
categorias: ["legendas"]
weight: 7
tempo: "5 min"
---

O **SubMaker** traduz legendas de qualquer conteúdo automaticamente, dentro do próprio Stremio. É o addon certo para quando não existem legendas em português disponíveis.

> **Nuvio:** O SubMaker funciona também no Nuvio. O processo de instalação é igual — instala o addon via URL do manifest e funciona da mesma forma.

**Tempo estimado: 5 min**

{{< callout type="info" >}}
**Já instalaste pelo QuickStart PT?** Não precisas de fazer mais nada — o SubMaker já vem configurado a traduzir com o Google Translate, sem chave API nenhuma. Salta já para o [Passo 2](#passo-2-usar-no-stremio).
{{< /callout >}}

---

## Passo 1: Configurar o SubMaker (só para instalação manual)

Se instalaste manualmente (fora do QuickStart PT), a página de configuração também te deixa escolher o motor de tradução:

1. Abre a [Página de Configuração do SubMaker](https://submaker.elfhosted.com/).

{{< img src="/images/submaker-configure.png" alt="Página de configuração do SubMaker com os campos de API Key e idiomas" >}}

2. Em **Idiomas**, escolhe `English` como origem e `Portuguese` como destino.

   > Manter apenas inglês como origem evita erros de deteção automática de idioma.

3. Em **Vários fornecedores (beta)**, ativa o checkbox e marca **Google Translate (unofficial)** — não pede chave nenhuma.

4. Clica em **Install**. O Stremio abre e instala o addon.

### Queres traduções melhores? Muda para o Gemini (opcional)

O Google Translate funciona sempre, mas é mais literal (falha gírias e expressões). Se quiseres o Gemini, que lê o contexto e traduz de forma mais natural:

1. Na secção **Chaves API → AI Translation API Keys**, cola uma chave gratuita do [Google AI Studio](https://aistudio.google.com).
2. Clica em **Install** outra vez — substitui a configuração anterior.

{{< callout type="warning" >}}
**A Google cortou bastante a oferta grátis da API Gemini** (finais de 2025). Com uso normal é fácil esgotar a quota e a tradução volta a parar, agora com o Gemini em vez de sem chave nenhuma. Duas formas de aliviar isto, ambas na mesma secção da configuração:

- **"Enable Gemini API key rotation"** — permite adicionar várias chaves e o SubMaker roda entre elas. **Importante:** os limites da Google são por *projecto* do Google Cloud, não por chave — criar 3 chaves na mesma conta/projecto não ajuda nada. Para a rotação valer a pena, cria cada chave num [projecto novo](https://aistudio.google.com) (Google deixa criar vários gratuitamente).
- **"Vários fornecedores (beta)"** — define o Gemini como principal e o **Google Translate (unofficial)** como secundário. Se o Gemini esgotar a quota (erro 429), cai automaticamente para o Google Translate em vez de parar de todo.
{{< /callout >}}

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

**A legenda demora mais de 1 minuto**. O motor de tradução (Google Translate ou Gemini, se mudaste) pode estar lento. Aguarda ou clica 3 vezes para forçar nova tentativa.

**Tradução estranha ou demasiado literal**. É o Google Translate (o motor por defeito) — traduz palavra a palavra, sem perceber gírias ou expressões. Se te incomodar, muda para o Gemini (ver acima).

**"A API do Gemini esgotou a quota" ou erro 429**. Se mudaste para o Gemini, a Google limita bastante a oferta grátis. Ou activas a rotação de várias chaves (com projectos Google Cloud separados), ou voltas ao Google Translate, que não tem este problema.

**Legenda dessincronizada**. O SubMaker traduz a legenda que escolheste, mas a sincronização depende do ficheiro original. Testa outra legenda em inglês até encontrar a que está bem sincronizada, e depois clica em "Criar [Portuguese]" nessa.

---

## Próximo passo

Para títulos e sinopses em português (não só legendas):

→ [Toast Translator: sinopses e ratings em PT](/guias/toast-translator)

---

## Links

- [SubMaker (Configuração)](https://submaker.elfhosted.com/)
- [Google AI Studio: obter Gemini API Key](https://aistudio.google.com)
