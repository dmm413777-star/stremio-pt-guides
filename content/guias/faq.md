---
title: "FAQ — Perguntas Frequentes"
date: 2025-01-01
description: "Respostas às dúvidas mais comuns sobre Debrid, VPN, addons e o Stremio em geral."
tags: ["faq", "debrid", "vpn", "addons", "stremio"]
categorias: ["ajuda"]
weight: 16
tempo: "leitura"
---

{{< callout type="info" >}}
**Créditos:** Baseado nos guias de [Viren070](https://guides.viren070.me/stremio/faq), adaptado para utilizadores portugueses.
{{< /callout >}}

---

## Debrid e VPN

**Preciso de um serviço de Debrid?**
Não é obrigatório. Sem Debrid o Stremio funciona via P2P (torrents), mas a qualidade depende de haver seeders activos. Com Debrid tens streams instantâneos em qualidade máxima, sem dependência de seeds. Para uso regular, vale a pena — ver [guia TorBox](/guias/torbox).

**Preciso de VPN com Debrid?**
Não. Com Debrid és tu a fazer download de um servidor HTTP, não de outros peers. VPN com Debrid até pode criar problemas (muda o teu IP e pode interferir com o limite de IPs do serviço).

**Posso usar o mesmo Debrid em vários dispositivos?**
Sim, desde que estejam na mesma rede doméstica (mesmo IP público). Fora de casa — por exemplo, usar ao mesmo tempo em casa e no telemóvel com dados móveis — viola os termos da maioria dos serviços, excepto o [TorBox](/guias/torbox) e o Premiumize.

**Por que o TorBox e não o Real Debrid?**
O Real Debrid (~32€/ano) bloqueia se usares de IPs diferentes em simultâneo. O TorBox (~28€/ano) não tem essa restrição, o que o torna mais prático para quem usa em vários dispositivos ou partilha com família — ver [comparação detalhada](/guias/torbox).

**Como faço teste de velocidade do meu Debrid?**
- TorBox: [torbox.app/speedtest](https://torbox.app/speedtest)
- Real Debrid: [real-debrid.com/speedtest](https://real-debrid.com/speedtest)
- AllDebrid: [alldebrid.com/speedtest](https://alldebrid.com/speedtest)

Se a velocidade for baixa, tenta mudar o servidor/rota nas definições do serviço.

---

## Addons

**Os addons sincronizam entre dispositivos?**
Sim. A tua conta e os addons instalados ficam guardados nos servidores do Stremio. Faz login em qualquer dispositivo e tudo aparece automaticamente.

**Como altero as configurações de um addon sem o reinstalar?**
Clica no ícone de ⚙️ ao lado do addon na lista de Addons. Altera o que precisas e clica "Install" — o Stremio substitui a versão anterior.

**Um addon não está a funcionar — o que faço?**
Primeiro verifica o estado em [status.elfhosted.com](https://status.elfhosted.com/) ou [status.dinsden.top](https://status.dinsden.top/status/stremio-addons). Se estiver a funcionar do lado do servidor, tenta reinstalar. Se o problema for o token Debrid, regenera a API Key e reconfigura.

**Como instalo um addon manualmente pelo URL?**
Copia o URL do manifest do addon (começa por `https://...manifest.json`). No Stremio Web vai a **Addons → Add Addon** e cola o URL. Na app desktop ou Android cola na barra de pesquisa dos Addons.

**Onde encontro mais addons?**
Em [stremio-addons.net](https://stremio-addons.net/) ou no separador **Community Addons** dentro do próprio Stremio.

---

## Stremio Geral

**O Stremio funciona em iPhone/iPad?**
Sim, mas com limitações. A versão iOS (Stremio Lite) não suporta torrents directamente — funciona com addons HTTP e Debrid. Para P2P tens de configurar um servidor de streaming noutro dispositivo. Com Debrid funciona bem.

**O Stremio funciona em Smart TV?**
Android TV e Google TV têm a app na Play Store. Samsung Tizen (2019+) e LG WebOS (2020+) têm nas respectivas lojas. Para outros modelos usa o Stremio Web ([web.stremio.com](https://web.stremio.com)) num browser, ou considera o [Nuvio](/guias/nuvio) para Android TV.

**Não está disponível para Apple TV ou Roku.**

**Como vejo ratings nos posters dos filmes?**
Usa a key gratuita `t0-free-rpdb` no campo RPDB durante a configuração de addons como o [Toast Translator](/guias/toast-translator) ou o AIOMetadata. Adiciona as notas do IMDb e Rotten Tomatoes directamente nas capas.

**Posso descarregar streams para ver offline?**
Com Debrid, começa a reprodução e depois descarrega o ficheiro directamente no site do serviço (ex: torbox.app). Sem Debrid, o botão dos três pontos num stream tem opção de Download em algumas versões.

**O que é o "watch together" e como funciona?**
O Stremio não tem esta funcionalidade de raiz. A melhor alternativa gratuita é o [Peario](https://peario.xyz/) — mas atenção: com Debrid, cada pessoa usa o IP dela, o que pode violar o limite de IPs do teu serviço. Para evitar isso usa o TorBox (sem limite de IPs) ou sincroniza manualmente.

**Como importo o meu histórico do Netflix?**
Usa o [Netflix-to-Trakt-Import](https://github.com/jensb89/Netflix-to-Trakt-Import) para migrar para o Trakt, que depois sincroniza com o Stremio.
