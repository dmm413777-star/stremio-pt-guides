---
title: "TorBox: Alternativa ao Real Debrid"
date: 2025-01-01
description: "Como comprar, ativar e configurar o TorBox no Stremio e Nuvio. O debrid mais económico, sem bloqueios por IP, ideal para partilhar com família."
tags: ["torbox", "debrid", "real-debrid", "stremio", "torrentio"]
categorias: ["debrid", "setup"]
weight: 5
tempo: "10 min"
---

{{< callout type="info" >}}
**Nota:** Um serviço de Debrid **não é obrigatório** para usar o Stremio ou o Nuvio. Serve para quem quer ver conteúdos 4K instantaneamente (tipo Netflix), sem paragens nem necessidade de fazer download, e sem depender de seeds/torrents ativos.
{{< /callout >}}

**Tempo estimado: 10 min**

---

## Por que TorBox?

| | **Real Debrid** | **TorBox** |
|---|---|---|
| Preço anual | ~32€ | ~28€ (~20€ com crypto) |
| Vários IPs simultâneos | ❌ Bloqueia | ✅ Funciona |
| Partilha com família | ❌ Arriscado | ✅ Sem problemas |
| Usenet (NZB) | ❌ Não | ✅ Plano Pro |

O **TorBox Essential Anual** (~$33) dá para **cerca de 15 meses** com o bónus de primeira adesão, e é a escolha mais popular na comunidade PT.

---

## Como Comprar (segue esta ordem)

### 1. Entra pelo link de referência

Usa **[este link](https://torbox.app/subscription?referral=444bd704-e54d-45d7-a058-5f1b4b3350cd)** para garantir **+84 dias de bónus** na primeira compra.

{{< callout type="warning" >}}
Se verificares a conta pelo e-mail de confirmação **antes de pagar**, o código de referência pode ser removido. Volta a clicar no link acima antes de finalizar o pagamento.
{{< /callout >}}

{{< fig-mobile src="/images/torbox-referral-dialog.jpg" alt="Dialog de confirmação do código de referência TorBox" >}}TorBox pede confirmação para aplicar o código de referência. Clica "Yes" para garantir os +84 dias.{{< /fig-mobile >}}

### 2. Escolhe o plano

Seleciona **Essential — One Time — ANUAL** ($33).

{{< fig-mobile src="/images/torbox-planos-essential.jpg" alt="Página de planos TorBox com Essential anual e cupão SIGMA30" >}}Seleciona Essential anual. O campo para o cupão SIGMA30 aparece neste mesmo ecrã.{{< /fig-mobile >}}

{{< callout type="warning" >}}
Se comprares **mensal**, só ganhas **7 dias** de bónus em vez de 84.
{{< /callout >}}

### 3. Aplica o cupão (apenas com Crypto)

No checkout, insere o código **`SIGMA30`** para 30% de desconto extra (fica ~20€).

{{< callout type="info" >}}
O cupão só funciona com **pagamento em criptomoedas**. Se as opções parecerem bloqueadas, certifica-te que selecionaste *Yearly — One Time*.
{{< /callout >}}

**Com cartão:** fica por cerca de **28€** sem cupão. Revolut ou N26 são boas opções (cobrado em dólares).

---

## Configurar no Stremio (com Torrentio)

1. Copia a tua **API Key** em [torbox.app/settings](https://torbox.app/settings?section=account).
2. Abre a configuração do [Torrentio](https://torrentio.strem.fun/configure).
3. Em **Debrid Provider**, seleciona **TorBox** e cola a API Key.

{{< img src="/images/torrentio-configure.png" alt="Página de configuração do Torrentio com TorBox selecionado como Debrid Provider" >}}

4. Marca a opção **"Don't show download to debrid links"** (última caixa).
5. Clica em **Install** para instalar no Stremio.

---

## Resultado Final

Após a instalação, os links com a tag **`[TB+]`** estão em **cache** e correm instantaneamente sem depender de seeds. Qualidade máxima, sem espera.

{{< img src="/images/stremio-tb-streams.jpg" alt="Lista de streams no Stremio com tags TB+ do TorBox" >}}

---

## Configurar no AIOStreams

Se usas o AIOStreams com o template do Tam-Taro, seleciona **TorBox** durante o assistente de configuração e cola a API Key quando pedida. O template adapta-se automaticamente. Ver [guia AIOStreams](/guias/aiostreams-tamtaro).

---

## Se algo correr mal

**Streams `[TB+]` não abrem ou dão erro**. A API Key pode ter expirado ou a subscrição acabou. Vai a [torbox.app/settings](https://torbox.app/settings?section=account), copia a chave actual e reinstala o addon com a nova key.

**Não aparecem streams `[TB+]`:** o ficheiro ainda não está em cache no TorBox. Tenta outro stream do mesmo conteúdo; o cache varia por ficheiro, não por título.

**Ecrã vermelho ao carregar stream**. Verifica se a subscrição TorBox ainda está activa em [torbox.app](https://torbox.app).

---

## Próximo passo

Com o TorBox configurado, é altura de instalar o AIOStreams para tirares partido máximo do debrid:

→ [AIOStreams + Template SEL do Tam-Taro](/guias/aiostreams-tamtaro)

---

## Links

- [TorBox (com link de referência +84 dias)](https://torbox.app/subscription?referral=444bd704-e54d-45d7-a058-5f1b4b3350cd)
- [API Key TorBox](https://torbox.app/settings?section=account)
- [Torrentio](https://torrentio.strem.fun/configure)
