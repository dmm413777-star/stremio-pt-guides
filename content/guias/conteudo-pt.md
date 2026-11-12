---
title: "Conteúdo Português: Filmes, Séries, Novelas e Animação"
date: 2026-08-11
description: "Addon de catálogo com conteúdo infantil e de animação em Português de Portugal: o CotonetKids, instalado automaticamente pelo QuickStart PT."
tags: ["filmes", "séries", "animação", "infantil", "português", "stremio", "catálogo", "cotonetkids"]
categorias: ["addons", "conteúdo-pt"]
weight: 20
tempo: "2 min"
---

Este addon adiciona catálogos de conteúdo em Português de Portugal diretamente ao ecrã inicial do Stremio. O CotonetKids é instalado automaticamente pelo [QuickStart PT](/) e não requer configuração; já inclui o [Cotonet](/guias/cotonet) e o PTGDrive.

---

## Animação PT-PT

**Addon:** CotonetKids (não oficial, alojado na Fly.io)

Filmes e séries infantis e de animação em português de Portugal, indicado para crianças, mas com títulos para todas as idades. Junta várias fontes numa só lista: TugaKids, PTGDrive, Opto KIDS (os títulos infantis grátis do Opto), RTP Zig Zag e séries escolhidas do YouTube, entre outras. Quando a mesma série existe em mais do que uma fonte, aparece uma só vez, com os streams de todas.

**Catálogos por omissão:** filmes e séries, por ordem de chegada. Na [página do addon](https://tvs-de-portugal.fly.dev/kids) podes ligar outras ordens (por lançamento, alfabética, clássicos) antes de instalar. Suporta pesquisa.

**Já inclui** o Cotonet e o PTGDrive, por isso não precisas de os instalar à parte.

### Configuração (opcional)

O addon funciona sem configurar nada. As fontes extra (Tugaflix, Os Teus Filmes Tuga e TVParaPobres KiDS) abrem, por omissão, num navegador. Para as tocar **dentro do Stremio** precisas de uma app tua, grátis na Vercel (ou no Fly.io), que pede o vídeo por ti, porque o link do vídeo só serve a quem o pediu:

1. Abre a [página do addon](https://tvs-de-portugal.fly.dev/kids), em **Fontes** clica em **Ver o comando** e corre-o num terminal (Mac e Linux) ou numa PowerShell (Windows). Precisas de ter o git e o Node.js instalados; o comando cria a app na tua conta da Vercel e mostra o endereço dela.
2. Cola esse endereço no campo por baixo: a página testa-o sozinha.
3. Clica em **Copiar link** e instala-o em [Instalar Addon por URL](/instalar-addon/), colando o link que copiaste.

Na mesma página escolhes também as listas que queres no Stremio (por chegada, por lançamento, alfabética, clássicos).

Só queres este addon? [Instalar CotonetKids na minha conta →](/instalar-addon/?url=https%3A%2F%2Ftvs-de-portugal.fly.dev%2Fkids%2Fmanifest.json)

---

## Instalar

O CotonetKids é instalado automaticamente pelo [QuickStart PT](/). Para o instalar à parte, acede ao manifest URL no browser e confirma a instalação no Stremio:

| Addon | Manifest URL |
|---|---|
| CotonetKids | `tvs-de-portugal.fly.dev/kids/manifest.json` |

---

## Ver também

- [Cotonet](/guias/cotonet): filmes em português com catálogo extenso e múltiplas formas de ordenação
- [TugaKids](/guias/tugakids): conteúdo infantil em português com registo por e-mail
