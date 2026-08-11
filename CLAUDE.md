# Stremio PT — Contexto do Projeto para Claude Code

Site de guias de Stremio e Nuvio em português + ferramenta QuickStart PT.
Hospedado gratuitamente em GitHub Pages. Deploy automático via GitHub Actions a cada push para `main`.

---

## Stack

- **Site:** Hugo + tema PaperMod
- **Ferramenta:** HTML + Vanilla JS puro em `/static/tools/quickstart/`
- **Hosting:** GitHub Pages gratuito

## Estrutura

```
content/guias/
  aiostreams-tamtaro.md   AIOStreams + SEL Tam-Taro (v3.0.4)
  aiometadata.md          Catálogos AIOMetadata
  nuvio.md                Nuvio (Android TV, autoplay)
  torbox.md               TorBox debrid
  submaker.md             SubMaker (legendas IA)
  toast-translator.md     Toast Translator + RPDB
  tugakids.md             TugaKids
  tmdb.md                 TMDB API Key

static/
  images/                 Screenshots dos guias
  tools/quickstart/       QuickStart PT (Fase 2)

.github/workflows/hugo.yml
hugo.toml
```

---

## Missão Principal do Agente

Quando abrires este projecto, faz o seguinte **por esta ordem, com o mínimo de interrupções ao utilizador**:

### 1. Auditoria de Qualidade (antes de qualquer outra coisa)

Lê todos os ficheiros em `content/guias/` e verifica:

**Linguagem e tom:**
- Substitui linguagem de AI por escrita humana natural. Sinais a eliminar:
  - Frases com "— " (travessão largo) como separador → substitui por vírgula, ponto ou reescreve
  - "É importante notar que...", "Vale a pena referir...", "Não esqueças que..." → corta ou reescreve directamente
  - Listas excessivas onde prosa seria mais natural
  - Adjectivos redundantes ("simples e directo", "fácil e rápido")
  - Frases demasiado longas com múltiplas subordinadas → parte em frases curtas
- O tom deve ser: comunidade portuguesa a falar com comunidade portuguesa. Directo, informal mas não desleixado.

**Precisão técnica — simula um utilizador real a seguir cada guia:**
- Percorre cada guia como se fosses alguém que nunca fez isto
- Verifica se os passos estão na ordem correcta e sem saltos
- Confirma que todos os URLs referenciados existem (faz fetch quando necessário)
- Verifica se os nomes de botões/opções nos guias correspondem ao que existe nas ferramentas reais
- Identifica passos ambíguos ("clica no botão de instalação" — qual botão exactamente?)
- Verifica se os screenshots `<!-- SCREENSHOT: ... -->` estão nos sítios certos e com descrições úteis

**Créditos:**
- Cada guia baseado em trabalho alheio deve ter créditos visíveis no topo
- Tam-Taro: GitHub (https://github.com/Tam-Taro/SEL-Filtering-and-Sorting) + Ko-fi (https://ko-fi.com/tamtaro)
- u/WildRabbitz: crédito no guia Nuvio
- TorBox referral link CORRECTO: https://torbox.app/subscription?referral=444bd704-e54d-45d7-a058-5f1b4b3350cd

**Consistência:**
- Terminologia consistente entre guias (ex: "addon" vs "add-on" — escolhe um e usa sempre)
- Versões referenciadas actualizadas (template Tam-Taro = v3.0.4)
- Português de Portugal em todo o lado (não brasileiro)

Faz todas as correcções directamente nos ficheiros. Não perguntes confirmação para correcções de linguagem ou precisão — faz e regista o que mudaste.

---

### 2. Setup do Repositório e Deploy

```bash
# Na pasta do projecto:
git init
git remote add origin [URL_DO_REPOSITÓRIO_GITHUB]
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
hugo server -D   # testa localmente, confirma que não há erros
git add -A
git commit -m "feat: initial site with PT guides"
git push -u origin main
```

Depois do push, instrui o utilizador a activar GitHub Pages:
> Settings → Pages → Source → GitHub Actions → Save
> URL final: https://[username].github.io/stremio-pt-guides

---

### 3. QuickStart PT

Cria `/static/tools/quickstart/index.html` — ferramenta que instala um pack PT pré-configurado numa conta Stremio com o mínimo de cliques possível.

**Princípios de UX:**
- Máximo 3 cliques do utilizador até os addons estarem instalados
- Zero configuração manual — tudo pré-configurado para PT
- Feedback visual em tempo real de cada passo
- Se algo falhar, mensagem clara do que fazer a seguir
- Não guardar credenciais — só usar o authKey em memória durante a sessão

**Fluxo (3 passos):**

```
[PASSO 1] Login Stremio
  Email + Password → POST https://api.strem.io/api/login
  → guarda authKey em memória (nunca em localStorage)
  → mostra: "✓ Conta verificada — [email]"

[PASSO 2] Seleccionar Pack (pré-seleccionado: tudo)
  Checkboxes já marcadas por defeito:
  ☑ AIOStreams + Template Tam-Taro SEL (v3.0.4) — streams principais
  ☑ AIOMetadata — catálogos organizados (Netflix, Disney+, etc.)
  ☑ SubMaker — legendas automáticas PT por IA
  ☑ Toast Translator — sinopses e títulos em PT
  Botão: "Instalar Agora →"

[PASSO 3] Instalação automática
  Para cada addon:
    GET manifest URL → valida que responde
    POST addonCollectionSet com lista actualizada
    → mostra progresso: "✓ AIOStreams instalado", "✓ AIOMetadata instalado"...
  Resultado final: "✓ X addons instalados. Abre o Stremio e já está."
```

**API Stremio:**
```javascript
// Login
const login = await fetch('https://api.strem.io/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, facebook: false })
})
const { result } = await login.json()
const authKey = result.authKey

// Ler addons actuais
const current = await fetch(
  `https://api.strem.io/api/addonCollectionGet?authKey=${authKey}&type=User&_=${Date.now()}`
)
const { result: { addons } } = await current.json()

// Instalar (merge com os existentes, sem apagar)
await fetch('https://api.strem.io/api/addonCollectionSet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ authKey, addons: [...addons, ...newAddons] })
})
```

**Manifest URLs do pack PT** (usa as instâncias públicas mais estáveis):
```javascript
const PT_PACK = [
  // AIOStreams com template Tam-Taro pré-configurado (instância Viren, nightly)
  // Nota: o manifest URL do AIOStreams inclui a config — usa uma config PT base
  // sem debrid (o utilizador adiciona o seu depois no AIOStreams)
  'https://aiostreams.viren070.me/stremio/manifest.json',

  // AIOMetadata (ElfHosted)
  'https://aiometadata.elfhosted.com/manifest.json',

  // SubMaker
  'https://submaker.elfhosted.com/manifest.json',

  // Toast Translator (PT por defeito)
  'https://0f693ad7dcba-toast-translator.baby-beamup.club/manifest.json',
]
```

**Importante:** Antes de instalar, faz GET a cada manifest URL para confirmar que o serviço está online. Se algum falhar, instala os que funcionam e indica quais falharam.

**Design:** Dark, minimalista, consistente com o site principal. Sem dependências externas — CSS e JS inline no mesmo ficheiro HTML.

---

## Referências Técnicas

- Tam-Taro SEL: https://github.com/Tam-Taro/SEL-Filtering-and-Sorting
- NuvioSync (referência para API Nuvio): https://nuviosync.com
- Duck Guides (referência de estrutura): https://duckkota.gitlab.io/guides/
- Viren070 (referência técnica): https://guides.viren070.me/stremio

---

## O que NÃO fazer

- Não construir Cloner ou Backup — o NuvioSync (nuviosync.com) já faz isso melhor
- Não pedir confirmação ao utilizador para cada pequena correcção de texto
- Não usar frameworks JS (React, Vue) — HTML + JS puro é suficiente e sem build step
- Não guardar passwords ou tokens em localStorage/sessionStorage
- Não traduzir para português do Brasil
