---
title: "TorBox — Alternativa ao Real Debrid"
date: 2025-01-01
description: "Como comprar, ativar e configurar o TorBox no Stremio e Nuvio. O debrid mais económico, sem bloqueios por IP, ideal para partilhar com família."
tags: ["torbox", "debrid", "real-debrid", "stremio", "torrentio"]
categorias: ["debrid", "setup"]
weight: 40
---

> **Nota:** Um serviço de Debrid **não é obrigatório** para usar o Stremio ou o Nuvio. Serve para quem quer ver conteúdos 4K instantaneamente (tipo Netflix), sem paragens nem necessidade de fazer download, e sem depender de seeds/torrents ativos.

---

## Por que TorBox?

| | **Real Debrid** | **TorBox** |
|---|---|---|
| Preço anual | ~16€ | ~28€ (~20€ com crypto) |
| Vários IPs simultâneos | ❌ Bloqueia | ✅ Funciona |
| Partilha com família | ❌ Arriscado | ✅ Sem problemas |
| Usenet (NZB) | ❌ Não | ✅ Plano Pro |

O **TorBox Essential Anual** (~$33) dá para **cerca de 15 meses** com o bónus de primeira adesão, e é a escolha mais popular na comunidade PT.

---

## Como Comprar (segue esta ordem)

### 1. Entra pelo link de referência

Usa **[este link](https://torbox.app/subscription?referral=444bd704-e54d-45d7-a058-5f1b4b3350cd)** para garantir **+84 dias de bónus** na primeira compra.

> ⚠️ Se verificares a conta pelo e-mail de confirmação **antes de pagar**, o código de referência pode ser removido. Volta a clicar no link acima antes de finalizar o pagamento.

<!-- SCREENSHOT: Página de subscrição do TorBox com o código de referência visível no URL ou no checkout -->

### 2. Escolhe o plano

Seleciona **Essential — One Time — ANUAL** ($33).

<!-- SCREENSHOT: Página de planos do TorBox com "Essential - One Time - Annual" selecionado -->

> ⚠️ Se comprares **mensal**, só ganhas **7 dias** de bónus em vez de 84.

### 3. Aplica o cupão (apenas com Crypto)

No checkout, insere o código **`SIGMA30`** para 30% de desconto extra (fica ~20€).

<!-- SCREENSHOT: Campo de cupão no checkout do TorBox com o código SIGMA30 inserido e desconto aplicado -->

> O cupão só funciona com **pagamento em criptomoedas**. Se as opções parecerem bloqueadas, certifica-te que selecionaste *Yearly — One Time*.

**Com cartão:** fica por cerca de **28€** sem cupão. Revolut ou N26 são boas opções (cobrado em dólares).

---

## Configurar no Stremio (com Torrentio)

1. Copia a tua **API Key** em [torbox.app/settings](https://torbox.app/settings?section=account).

<!-- SCREENSHOT: Página de Settings do TorBox com a API Key visível (podes ocultar parte da key) -->

2. Abre a configuração do [Torrentio](https://torrentio.strem.fun/configure).
3. Em **Debrid Provider**, seleciona **TorBox** e cola a API Key.

<!-- SCREENSHOT: Página de configuração do Torrentio com TorBox selecionado como provider e o campo da API Key preenchido -->

4. Marca a opção **"Don't show download to debrid links"** (última caixa).
5. Clica em **Install** para instalar no Stremio.

---

## Resultado Final

Após a instalação, os links com a tag **`[TB+]`** estão em **cache** — correm instantaneamente sem depender de seeds. Qualidade máxima, sem espera.

<!-- SCREENSHOT: Lista de streams no Stremio mostrando links com a tag [TB+] — resultado final após configuração do TorBox -->

---

## Configurar no AIOStreams

Se usas o AIOStreams com o template do Tam-Taro, seleciona **TorBox** durante o assistente de configuração e cola a API Key quando pedida. O template adapta-se automaticamente — ver [guia AIOStreams](/guias/aiostreams-tamtaro).

---

## Links

- [TorBox (com link de referência +84 dias)](https://torbox.app/subscription?referral=444bd704-e54d-45d7-a058-5f1b4b3350cd)
- [API Key TorBox](https://torbox.app/settings?section=account)
- [Torrentio](https://torrentio.strem.fun/configure)
