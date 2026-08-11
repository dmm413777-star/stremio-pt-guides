---
title: "Migrar do Stremio para o Nuvio"
date: 2025-01-01
description: "Como usar o NuvioSync para mover a tua biblioteca, histórico e addons do Stremio para o Nuvio, sem conta Trakt e sem perder nada."
tags: ["nuvio", "stremio", "migração", "nuviosync", "biblioteca"]
categorias: ["nuvio", "setup"]
weight: 13
tempo: "10 min"
---

{{< callout type="info" >}}
**Créditos:** Ferramenta criada por [NuvioSync](https://nuviosync.com). Guia adaptado em português pela comunidade.
{{< /callout >}}

---

O **NuvioSync** migra o teu setup do Stremio para o Nuvio em 5 passos: liga as contas, escolhes o que migra, vês uma pré-visualização antes de qualquer alteração, e só então a ferramenta escreve os dados.

**O que migra:**
- Biblioteca (filmes e séries marcados)
- Histórico de visualizações
- Continue Watching
- Addons instalados

**Não requer conta Trakt.** Podes escolher exactamente quais filmes e séries transitam.

---

## Antes de começar

Faz um backup do teu perfil Nuvio antes da migração. O NuvioSync oferece esta opção durante o processo — não a saltes. Se algo correr mal, podes restaurar o perfil ao estado anterior.

---

## Passo a Passo

### Passo 1 — Ligar o Stremio

Abre [nuviosync.com](https://nuviosync.com) e em **Stremio Migration**, clica em **Connect Stremio**.

Podes autenticar com email/password ou directamente com a tua **Auth Key** do Stremio (encontras em [app.strem.io](https://app.strem.io) → Definições → conta → Auth Key).

### Passo 2 — Ligar o Nuvio

Liga a tua conta Nuvio. O NuvioSync vai listar os teus perfis disponíveis.

### Passo 3 — Seleccionar o perfil de destino

Escolhe o perfil Nuvio onde queres importar os dados. Se queres começar do zero sem tocar num perfil existente, cria um perfil novo directamente durante este passo.

### Passo 4 — Escolher o que migrar

Selecciona o que queres transferir:
- ☑ Filmes da biblioteca
- ☑ Séries da biblioteca
- ☑ Addons
- ☑ Histórico / Continue Watching

Podes seleccionar individualmente quais títulos transitam — não tens de migrar tudo.

### Passo 5 — Pré-visualização e confirmação

O NuvioSync mostra uma pré-visualização completa de tudo o que vai ser alterado antes de escrever qualquer coisa. Confirma e clica em **Start Migration**.

---

## O que fazer a seguir

Depois da migração abre o Nuvio e confirma que os addons aparecem. O AIOStreams e outros addons baseados em URL devem aparecer directamente — os addons que requerem configuração adicional (API Keys, etc.) podem precisar de ser reconfigurados no Nuvio.

---

## Links

- [NuvioSync](https://nuviosync.com)
- [Guia Nuvio](/guias/nuvio) — instalar e configurar o Nuvio
- [Clonar perfil Nuvio](/guias/clonar-perfil-nuvio) — copiar o teu setup para outro perfil (ex: conta de familiar)
