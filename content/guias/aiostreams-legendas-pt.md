---
title: "AIOStreams: Legendas PT Incorporadas"
date: 2025-01-01
description: "Como configurar o AIOStreams para dar prioridade a streams com legendas em português já embutidas no ficheiro, sem depender de addons externos."
tags: ["aiostreams", "legendas", "português", "filtros", "stremio"]
categorias: ["legendas", "setup"]
weight: 6
tempo: "5 min"
---

{{< callout type="info" >}}
**Créditos:** Configuração partilhada pela comunidade [r/PiratariaTuga](https://www.reddit.com/r/PiratariaTuga/).
{{< /callout >}}

**Tempo estimado: 5 min**

{{< callout type="warning" >}}
**Antes de começares:** O AIOStreams já tem de estar instalado e configurado. Ver [guia AIOStreams](/guias/aiostreams-tamtaro).
{{< /callout >}}

---

O AIOStreams consegue filtrar e ordenar os streams de forma a mostrar primeiro (ou exclusivamente) os que têm legendas em português já embutidas no ficheiro de vídeo. Útil para quem prefere legendas incorporadas em vez de depender do SubMaker ou outros addons de legendas.

Há dois modos:

| Modo | O que faz |
|---|---|
| **Preferred** | Streams com legendas PT aparecem primeiro; os restantes também ficam visíveis |
| **Required** | Só aparecem streams com legendas PT. Lista mais limpa, mas pode estar vazia para conteúdo raro |

---

## Configurar o Sort Order (obrigatório em ambos os modos)

Antes de activar os filtros de legenda, garante que a ordenação dá prioridade às legendas. Nas definições do AIOStreams, vai a **Sort Order → Primary Sort Order** e define a seguinte ordem:

1. **Subtitle** (legendas)
2. **Quality** (qualidade)
3. **Size** (tamanho)

{{< img src="/images/aiostreams-sort-order.webp" alt="Ordenação no AIOStreams: Subtitle → Quality → Size" >}}

---

## Modo Preferred: Legendas PT em Primeiro

Neste modo vês todos os streams, mas os que têm legendas PT aparecem no início da lista.

Nas definições do AIOStreams, vai a **Subtitle Filters → Preferred Subtitles** e adiciona:

- `Portuguese`
- `Portuguese (Brazil)`

{{< img src="/images/aiostreams-subtitles-preferred.webp" alt="Filtro Preferred Subtitles no AIOStreams com Portuguese seleccionado" >}}

### Resultado

{{< img src="/images/aiostreams-resultado-preferido.webp" alt="Lista de streams no Stremio com streams com legendas PT em primeiro lugar" >}}

---

## Modo Required: Só Streams com Legendas PT

Neste modo o AIOStreams cria um grupo separado ("Legendado PT") que mostra exclusivamente streams com legendas PT incorporadas. Os outros streams ficam num grupo diferente.

Nas definições, vai a **Subtitle Filters → Required Subtitles** e adiciona:

- `Portuguese`
- `Portuguese (Brazil)`

{{< img src="/images/aiostreams-subtitles-required.webp" alt="Filtro Required Subtitles no AIOStreams com Portuguese seleccionado" >}}

### Resultado

{{< img src="/images/aiostreams-resultado-required.webp" alt="Lista de streams no Stremio com aba " >}}

---

## Qual modo usar?

- **Sem muito conteúdo PT disponível** (séries antigas, filmes de nicho) → usa **Preferred**, para não ficares sem resultados.
- **Só queres legendas incorporadas** e o conteúdo tem boa disponibilidade → usa **Required** para uma lista mais limpa.

Podes combinar os dois: activa **Preferred** como base e testa **Required** para o conteúdo onde sabes que há boa disponibilidade em PT.

---

## Próximo passo

Se o conteúdo que queres não tiver legendas em PT embutidas, usa o SubMaker para gerar a tradução em tempo real:

→ [SubMaker: Legendas por IA](/guias/submaker)

---

## Links

- [Guia AIOStreams + Tam-Taro](/guias/aiostreams-tamtaro): configuração base
- [SubMaker](/guias/submaker): alternativa quando não há legendas incorporadas
