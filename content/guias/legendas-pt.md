---
title: "Legendas e Conteúdo em Português"
date: 2025-01-01
description: "Como ter legendas em português, sinopses traduzidas e conteúdo infantil PT no Stremio: SubMaker, Toast Translator, RPDB e TugaKids."
tags: ["legendas", "português", "submaker", "toast", "tugakids", "rpdb", "tmdb"]
categorias: ["legendas", "localização"]
weight: 18
---

{{< callout type="info" >}}
**Créditos:** Informação compilada a partir de posts da comunidade no r/PiratariaTuga.
{{< /callout >}}

---

## SubMaker: Tradução de Legendas por IA

O **SubMaker** traduz legendas de qualquer conteúdo usando Inteligência Artificial (Google Gemini, ChatGPT, etc.). Ideal para quando não existem legendas PT disponíveis.

### Configuração

1. Abre a [Página de Configuração do SubMaker](https://submaker.elfhosted.com/).
2. **API Key:** Recomenda-se o **Google Gemini** (gratuito e rápido). Clica no link *"Get Gemini API Key"* que aparece na página, cria uma chave e cola no campo **Gemini API Key**.
3. **Source Language (Origem):** Seleciona apenas `English` (evita confusões de deteção).
4. **Target Language (Destino):** Seleciona `Portuguese`.
5. Clica em **Install**.

### Como Usar no Stremio

O SubMaker não mostra a legenda imediatamente. Funciona por pedido dentro do stream:

1. Abre o filme ou série.
2. Na lista de legendas, vês opções com **"Criar [Portuguese]"**.
3. **Antes de clicar:** Testa uma legenda em inglês para confirmar qual está sincronizada.
4. Clica em **"Criar [Portuguese]"** correspondente à legenda correta.
5. **Aguarda 20 a 30 segundos** (o sistema está a traduzir).
6. Volta a selecionar a mesma legenda. O texto já aparece em português.

{{< callout type="info" >}}
**Dica:** Se a tradução parecer estranha ou falhar, clica **3 vezes rapidamente** na mesma legenda para forçar uma nova tradução.
{{< /callout >}}

---

## Toast Translator + RPDB: Sinopses em PT e Ratings nos Posters

Este combo traduz títulos e sinopses para **Português de Portugal** e adiciona as pontuações do IMDb/Rotten Tomatoes diretamente nas capas dos filmes.

### Passo 1: Criar API Key TMDB (para as traduções)

1. Cria conta e faz login em [themoviedb.org](https://www.themoviedb.org/).
2. Clica no ícone de perfil → **Settings → API** (menu lateral).
3. Clica em **"Create"** → Escolhe **Developer**.
4. Aceita os termos e preenche o formulário:
   - **Type of Use:** `Personal`
   - **Application URL:** `http://google.com` *(o site obriga a ter um link)*
   - **Application Summary:** `Using for personal metadata on Stremio addon to translate synopsis`
   - **Address/Phone:** Dados genéricos.
5. Copia a chave **"API Key (v3 auth)"**.

{{< callout type="info" >}}
Para um guia mais completo sobre a TMDB API Key, vê [aqui](/guias/tmdb).
{{< /callout >}}

### Passo 2: Configurar o Toast Translator

1. Abre a [Página de Configuração do Toast](https://0f693ad7dcba-toast-translator.baby-beamup.club/configure).
2. **TMDB API Key:** Cola a key do passo anterior.
3. **RPDB API Key:** Usa a key gratuita `t0-free-rpdb` (sem registo necessário).
4. **Translate to:** Seleciona `Portuguese (Portugal)`.
5. Clica em **Install**.

---

## TugaKids: Conteúdo Infantil PT

O **TugaKids** é um addon com conteúdo infantil em português. O acesso é **automatizado**: ao registares, é gerado um link de instalação único enviado para o teu e-mail.

### Como Obter Acesso

1. Abre a [Página de Configuração do TugaKids](https://e1d6cc1ff4a7-tugakids-stremio.baby-beamup.club/).
2. Regista o teu e-mail e segue as instruções.
3. Receberás o link de instalação único no e-mail.

### ⚠️ Atenção ao Registar

- **E-mail deve ser válido** e com espaço disponível.
- **Evita padrões de spam:** e-mails com letras aleatórias ou muitos números são frequentemente bloqueados automaticamente.
- **Evita aliases e domínios temporários** (Guerrilla Mail, etc.). Fazem parte de listas de spam e o acesso não é enviado mesmo que o sistema diga que foi.

---

## Links Rápidos

| Ferramenta | Link |
|---|---|
| SubMaker | [submaker.elfhosted.com](https://submaker.elfhosted.com/) |
| Toast Translator | [Página de Configuração](https://0f693ad7dcba-toast-translator.baby-beamup.club/configure) |
| TugaKids | [Página de Configuração](https://e1d6cc1ff4a7-tugakids-stremio.baby-beamup.club/) |
| Google AI Studio (Gemini) | [aistudio.google.com](https://aistudio.google.com) |
| TMDB | [themoviedb.org](https://www.themoviedb.org/) |
