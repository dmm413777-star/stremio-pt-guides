#!/usr/bin/env node
// Deteta quando o template publicado pelo Tam-Taro (fonte do nosso
// buildAIOStreamsConfig() em layouts/shortcodes/quickstart.html) muda de
// forma que possa afetar a nossa configuração estática, e confirma que os
// URLs de addons/sincronização que usamos continuam a responder.
//
// Não precisa de credenciais — só lê URLs públicas. Não altera nada no
// repositório nem faz commits; isso é feito pelo workflow que o chama.
//
// Uso: node scripts/check-tamtaro-drift.js
// Sai com código 1 se houver qualquer diferença ou URL morto, 0 se tudo OK.

const TEMPLATE_URL = 'https://raw.githubusercontent.com/Tam-Taro/SEL-Filtering-and-Sorting/main/Tamtaro-All-Templates-for-AIOStreams.json';
const VERSION_FILE = new URL('./.tamtaro-last-version.json', `file://${__dirname}/`);
const ACCEPTED_FILE = new URL('./tamtaro-drift-aceites.json', `file://${__dirname}/`);

// Diferenças conhecidas e aceites conscientemente (ver scripts/tamtaro-drift-aceites.json).
// Só diferenças NOVAS ou alteradas em relação a este ficheiro fazem o script falhar.
function loadAccepted() {
  try {
    return JSON.parse(require('fs').readFileSync(ACCEPTED_FILE, 'utf-8'));
  } catch {
    return { titleMatching: null, presetsP2PAdicionados: [] };
  }
}

// Cópia dos valores estáticos do nosso buildAIOStreamsConfig() — mantidos à
// mão aqui porque o script corre fora do contexto do browser/Hugo. Se
// alterares esses valores em quickstart.html, actualiza também aqui.
const OURS = {
  deduplicator: {
    enabled: true,
    excludeAddons: [],
    multiGroupBehaviour: 'aggressive',
    keys: ['filename', 'infoHash', 'smartDetect'],
    cached: 'single_result',
    uncached: 'single_result',
    p2p: 'single_result',
    http: 'per_addon',
    smartDetectAttributes: ['size', 'resolution', 'quality', 'visualTags', 'audioTags', 'audioChannels', 'languages', 'encode', 'edition', 'network', 'remastered', 'bitrate', 'releaseGroup'],
    smartDetectRounding: 10,
    libraryBehaviour: 'prefer',
    merge: { enabled: true, failoverVariants: true, fields: ['sizes', 'seadex', 'library', 'subtitles', 'languages'] },
  },
  titleMatching: { mode: 'exact', similarityThreshold: 1, enabled: false, ambiguousResults: 'keep', requestTypes: ['movie', 'series', 'anime'], addons: [] },
  presetTypesP2P: ['meteor', 'comet', 'stremthruTorz', 'mediafusion', 'peerflix', 'torrentio', 'opensubtitles-v3-plus'],
  presetTypesDebrid: ['seadex', 'library', 'neko-bt', 'torznab', 'stremthruTorz', 'meteor', 'knaben', 'mediafusion', 'opensubtitles-v3-plus'],
};

// URLs fixos (sem API key) que o QuickStart depende de estarem no ar.
const URLS_TO_CHECK = [
  ['AIOMetadata (instância base)', 'https://aiometadata.elfhosted.com/manifest.json'],
  ['SubMaker', 'https://submaker.elfhosted.com/manifest.json'],
  ['Toast Translator', 'https://toast-translator.elfhosted.com/manifest.json'],
  ['Animação PT-PT', 'https://anima-o-pt-pt-addon-stremio-6dzv.vercel.app/manifest.json'],
  ['Cotonet', 'https://cotonetnet-cotonet.hf.space/manifest.json'],
  ['PTGDrive', 'https://pt-pt-gdrive.newptdrive.workers.dev/manifest.json'],
  ['AIOStreams (instância usada no pack)', 'https://aiostreams.viren070.me/stremio/manifest.json'],
  ['Regex excluído sincronizado (Tam-Taro)', 'https://git.tamtaro.de/Excluded-Regex.json'],
  ['Stream Expression incluído sincronizado (Tam-Taro)', 'https://git.tamtaro.de/ISE.json'],
  ['Regex ranked sincronizado (Vidhin)', 'https://raw.githubusercontent.com/Vidhin05/Releases-Regex/main/English/expressions.json'],
];

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

async function fetchJson(url, timeoutMs = 15000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function checkUrl(url, timeoutMs = 10000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    return { ok: false, status: null, error: err.message };
  } finally {
    clearTimeout(timer);
  }
}

// Extrai a lista de 'type' dos presets dentro de um ramo (__switch por
// 'services') do template bruto do Tam-Taro.
function extractPresetTypes(presetsField, branchKey) {
  if (!presetsField || !presetsField.__value || !presetsField.__value.__switch) return null;
  const cases = presetsField.__value.cases || {};
  const list = cases[branchKey];
  if (!Array.isArray(list)) return null;
  return list.map(p => p.type);
}

async function main() {
  const problems = [];
  const notes = []; // informativo apenas (não conta como diferença, ex.: 1ª execução)
  const accepted = []; // diferenças conhecidas e aceites (scripts/tamtaro-drift-aceites.json) — não contam como falha
  const ACCEPTED = loadAccepted();

  // 1. Template Tam-Taro — versão e campos estáticos comparáveis
  let template = null;
  try {
    const raw = await fetchJson(TEMPLATE_URL);
    template = Array.isArray(raw) ? raw[0] : raw;
  } catch (err) {
    problems.push(`Não consegui obter o template do Tam-Taro (${TEMPLATE_URL}): ${err.message}`);
  }

  if (template) {
    const version = template.metadata && template.metadata.version;
    let lastVersion = null;
    try {
      const fs = require('fs');
      lastVersion = JSON.parse(fs.readFileSync(VERSION_FILE, 'utf-8')).version;
    } catch { /* primeira execução, sem histórico */ }

    if (version && lastVersion && version !== lastVersion) {
      problems.push(`Template do Tam-Taro mudou de versão: ${lastVersion} → ${version}. Convém reconfirmar manualmente o wizard (ver README do repo) antes de assumir que a nossa config estática continua alinhada.`);
    } else if (version && !lastVersion) {
      notes.push(`Primeira execução — a registar a versão actual do template (${version}) como referência.`);
    }
    if (version) {
      try {
        require('fs').writeFileSync(VERSION_FILE, JSON.stringify({ version, checkedAt: new Date().toISOString() }, null, 2));
      } catch { /* sem permissão de escrita (ex.: CI read-only) — ignora */ }
    }

    const cfg = template.config || {};

    if (cfg.deduplicator && !deepEqual(cfg.deduplicator, OURS.deduplicator)) {
      problems.push('O "deduplicator" do template Tam-Taro mudou e já não coincide com o nosso (buildAIOStreamsConfig em quickstart.html).');
    }
    if (cfg.titleMatching && !deepEqual(cfg.titleMatching, OURS.titleMatching)) {
      if (ACCEPTED.titleMatching && deepEqual(cfg.titleMatching, ACCEPTED.titleMatching.value)) {
        accepted.push(`"titleMatching" continua diferente do nosso, como já era esperado (aceite desde ${ACCEPTED.titleMatching.desde}): ${ACCEPTED.titleMatching.motivo}`);
      } else {
        problems.push('O "titleMatching" do template Tam-Taro mudou para um valor novo, diferente do nosso E do que está registado em scripts/tamtaro-drift-aceites.json — convém rever manualmente.');
      }
    }

    const p2pTypes = extractPresetTypes(cfg.presets, '');
    if (p2pTypes) {
      const added = p2pTypes.filter(t => !OURS.presetTypesP2P.includes(t));
      const removed = OURS.presetTypesP2P.filter(t => !p2pTypes.includes(t));
      const acceptedTypes = (ACCEPTED.presetsP2PAdicionados || []).map(e => e.type);
      const newAdded = added.filter(t => !acceptedTypes.includes(t));
      const acceptedAdded = added.filter(t => acceptedTypes.includes(t));
      if (newAdded.length) problems.push(`Presets novos no template P2P do Tam-Taro que não temos nem estão em scripts/tamtaro-drift-aceites.json: ${newAdded.join(', ')}.`);
      if (acceptedAdded.length) {
        for (const t of acceptedAdded) {
          const entry = ACCEPTED.presetsP2PAdicionados.find(e => e.type === t);
          accepted.push(`Preset "${t}" continua no template Tam-Taro mas não na nossa config, como já era esperado (aceite desde ${entry.desde}): ${entry.motivo}`);
        }
      }
      if (removed.length) problems.push(`Presets que já não aparecem no template P2P do Tam-Taro mas continuamos a usar: ${removed.join(', ')} (pode ser remoção intencional nossa — ver comentários em quickstart.html).`);
    } else {
      notes.push('Não consegui extrair a lista de presets P2P do template (estrutura do template pode ter mudado).');
    }
  }

  // 2. URLs fixos de que o QuickStart depende
  const results = await Promise.all(URLS_TO_CHECK.map(async ([label, url]) => {
    const r = await checkUrl(url);
    return { label, url, ...r };
  }));
  for (const r of results) {
    if (!r.ok) {
      problems.push(`${r.label} (${r.url}) não respondeu bem: ${r.error || 'HTTP ' + r.status}.`);
    }
  }

  // Resumo PT-PT
  console.log('--- Verificação de deriva do template Tam-Taro / URLs do QuickStart ---\n');
  if (template && template.metadata) {
    console.log(`Template Tam-Taro: "${template.metadata.name}" v${template.metadata.version}\n`);
  }
  console.log(`URLs verificados: ${results.length} (${results.filter(r => r.ok).length} OK, ${results.filter(r => !r.ok).length} com problemas)\n`);

  if (notes.length) {
    console.log('Notas informativas (não contam como diferença):');
    for (const n of notes) console.log(`  • ${n}`);
    console.log('');
  }

  if (accepted.length) {
    console.log('Diferenças conhecidas e aceites (ver scripts/tamtaro-drift-aceites.json — não contam como falha):');
    for (const a of accepted) console.log(`  ○ ${a}`);
    console.log('');
  }

  if (problems.length) {
    console.log('Diferenças / problemas encontrados:');
    for (const p of problems) console.log(`  ✗ ${p}`);
    console.log('');
    console.log(`FALHOU — ${problems.length} diferença(s)/problema(s).`);
    process.exit(1);
  } else {
    console.log('Tudo OK — sem diferenças nem URLs mortos.');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Erro inesperado a correr o script:', err);
  process.exit(1);
});
