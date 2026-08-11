---
title: "Problemas Comuns e Soluções"
date: 2025-01-01
description: "Diagnóstico rápido dos problemas mais frequentes no Stremio: lista de streams vazia, buffering, addons com erro e streams TB+ que não funcionam."
tags: ["troubleshooting", "streams", "buffering", "debrid", "stremio"]
categorias: ["ajuda"]
weight: 71
---

> **Créditos:** Baseado nos guias de [Viren070](https://guides.viren070.me/stremio/troubleshooting), adaptado para utilizadores portugueses.

---

## Lista de streams vazia ("No streams were found")

**Causa mais comum:** O addon não está configurado correctamente, ou o ISP está a bloquear o acesso ao tracker.

**O que fazer:**
1. Verifica se o addon (ex: Torrentio, AIOStreams) está instalado e activo — vai a Addons e procura-o na lista.
2. Confirma se o conteúdo que procuras está disponível digitalmente (filmes em cartaz nos cinemas raramente têm streams).
3. Verifica o estado do addon em [status.elfhosted.com](https://status.elfhosted.com/) ou [status.dinsden.top](https://status.dinsden.top/status/stremio-addons).
4. Se o problema for específico do ISP, tenta mudar os DNS do router: instruções em [blog.stremio.com/change-dns-resolution](https://blog.stremio.com/change-dns-resolution/).

---

## Buffering ou imagem aos solavancos

**Causa mais comum:** A velocidade de download não acompanha o bitrate do stream, ou o servidor Debrid está com carga.

**O que fazer:**
1. Faz um teste de velocidade: [samknows.com/realspeed](https://samknows.com/realspeed/) — precisas de pelo menos 25 Mbps para 4K.
2. Se tens Debrid, faz o speedtest específico do serviço (ver [FAQ](/guias/faq)).
3. Nas definições do Stremio, aumenta o **streaming cache** e tenta activar/desactivar **hardware acceleration**.
4. Muda para um stream de qualidade inferior (1080p em vez de 4K).
5. Se o problema for consistente, tenta outro servidor/rota nas definições do teu serviço Debrid.

---

## Ecrã vermelho ou stream Debrid não abre

**Causa:** A API Key do Debrid expirou, a subscrição acabou, ou o token foi regenerado.

**O que fazer:**
1. Abre o site do teu serviço Debrid e verifica se a subscrição está activa.
2. Vai às definições do teu serviço → API → copia a chave actual.
3. Reinstala o addon com a nova API Key (Addons → ⚙️ → actualiza o campo da key → Install).

---

## Tags [TB+] não funcionam / stream não abre

**Sintoma:** O stream aparece com `[TB+]` mas ao clicar dá erro ou não abre.

**Causa mais comum:** A API Key do TorBox expirou ou foi regenerada. Ou o ficheiro específico não está em cache no TorBox.

**O que fazer:**
1. Abre [torbox.app/settings](https://torbox.app/settings?section=account) e copia a API Key actual.
2. Reinstala o Torrentio ou AIOStreams com a nova key.
3. Se o `[TB+]` desapareceu e passou a `[RD+]` ou similar, verifica qual addon tens configurado com o TorBox.
4. Se o stream específico nunca chegou a fazer cache, tenta outro stream do mesmo conteúdo — o cache do TorBox varia por ficheiro, não por título.

---

## Addon instalado mas não aparece streams de qualidade

**Sintoma:** O addon está instalado, aparecem streams, mas só com qualidade baixa (480p, 720p) ou com muitos problemas de codec.

**Causa:** Sem Debrid, os streams dependem de seeders activos. Em horas de menor actividade ou para conteúdo antigo, os seeders são poucos.

**O que fazer:**
1. Com [TorBox](/guias/torbox) ou outro Debrid, os streams ficam em cache — qualidade garantida independente de seeders.
2. No AIOStreams com template Tam-Taro, verifica se o modo Debrid está activado nas configurações.
3. Experimenta o [AIOMetadata](/guias/aiometadata) para ver se o matching do título está correcto (um episódio identificado errado puxa streams do episódio errado).

---

## Addon com erro ou a não carregar

**Sintoma:** O addon aparece na lista mas mostra um ícone de erro, ou demora infinitamente a carregar.

**O que fazer:**
1. Verifica o estado em [status.elfhosted.com](https://status.elfhosted.com/).
2. Tenta desinstalar e reinstalar o addon.
3. Se for um addon público (como o AIOStreams na instância do Viren070), tenta uma instância alternativa — ver lista em [status.dinsden.top](https://status.dinsden.top/status/stremio-addons).

---

## Legendas não aparecem ou estão mal formatadas

**Sintoma:** As legendas existem na lista mas não aparecem no vídeo, ou o formato é estranho (caixas em vez de texto).

**Causa:** O Stremio usa o ExoPlayer internamente, que não suporta legendas no formato SSA/ASS.

**O que fazer:**
- Muda para um player externo (ex: VLC, MX Player, Vimu Player) via **Definições → Player → Play in external player**.
- Ou filtra streams com legendas PT embutidas directamente no AIOStreams — ver [guia legendas PT](/guias/aiostreams-legendas-pt).
