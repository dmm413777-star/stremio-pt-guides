// Diagnóstico da conta — análise só de leitura + relatório sanitizado para o
// subreddit. Funções puras, testáveis sem depender de rede (ver tests/qa/16-*).
// Requer AccountUtil (util.js) carregado antes deste ficheiro.
(function (global) {
  'use strict';

  const util = global.AccountUtil;

  // Instâncias públicas conhecidas do pack PT — hosts fora desta lista aparecem
  // no relatório como "instância privada" (um domínio self-hosted pode identificar
  // a pessoa, por isso nunca aparece o host real se não estiver nesta lista).
  const KNOWN_HOSTS = new Set([
    'aiometadata.elfhosted.com',
    'aiostreams.viren070.me',
    'aiostreams-nightly.206111.xyz',
    'aiostreams-nightly.fortheweak.cloud',
    'aiostreamsfortheweebs.midnightignite.me',
    'cotonetnet-cotonet.hf.space',
    'pt-pt-gdrive.newptdrive.workers.dev',
    'submaker.elfhosted.com',
    'toast-translator.elfhosted.com',
    'tvs-de-portugal.fly.dev',
    'v3-cinemeta.strem.io',
    'opensubtitles.strem.io',
    'opensubtitles-v3.strem.io',
    'catalog.nuvio.tv',
    'api.nuvio.tv',
  ]);

  const CINEMETA_OFFICIAL_HOST = 'v3-cinemeta.strem.io';
  const CINEMETA_MANIFEST_ID = 'com.linvo.cinemeta';

  // Identifica o Cinemeta oficial só pelo host do transportUrl — nunca pelo
  // manifest.id nem pelo nome. Outros addons (ex. "Cinemeta PT" do Toast
  // Translator) reportam de propósito o mesmo manifest.id para se apresentarem
  // como uma versão do mesmo addon, sem serem o oficial.
  function isOfficialCinemeta(addon) {
    const url = addon && (addon.transportUrl || addon.url);
    if (!url) return false;
    try { return new URL(url).host === CINEMETA_OFFICIAL_HOST; } catch { return false; }
  }

  function hostLabel(url) {
    const origin = util.urlOrigin(url);
    if (!origin) return 'origem desconhecida';
    const host = origin.replace(/^https?:\/\//, '');
    return KNOWN_HOSTS.has(host) ? host : 'instância privada';
  }

  // Tenta uma vez contra o URL dado; devolve null em sucesso ou um motivo de falha.
  async function tryManifestFetch(url) {
    try {
      const res = await util.fetchTimeout(url, 8000);
      if (!res.ok) return { ok: false, kind: 'http', status: res.status };
      try {
        await res.json();
        return { ok: true };
      } catch {
        return { ok: false, kind: 'invalid' };
      }
    } catch (err) {
      if (err.name === 'AbortError') return { ok: false, kind: 'timeout' };
      return { ok: false, kind: 'network' };
    }
  }

  // Verifica se um manifest responde, distinguindo timeout/rede de resposta inválida.
  // Alguns addons (ex. defaults nativos do Nuvio, como o OpenSubtitles v3) ficam
  // guardados com o URL base sem "/manifest.json" — tenta sempre com o sufixo
  // antes de reportar erro, em vez de assumir que o addon está mesmo offline.
  async function checkManifest(url) {
    const first = await tryManifestFetch(url);
    if (first.ok) return first;
    if (!url.endsWith('/manifest.json')) {
      const withSuffix = url.replace(/\/?$/, '/manifest.json');
      const second = await tryManifestFetch(withSuffix);
      if (second.ok) return second;
    }
    return first;
  }

  // Analisa a colecção (só leitura). Addons já têm transportUrl normalizado
  // (ver StremioAccountAPI/NuvioAccountAPI.getAddons).
  // concurrency limita pedidos de manifest em paralelo.
  async function analyzeAddons(addons, opts) {
    opts = opts || {};
    const concurrency = opts.concurrency || 4;
    const issues = [];

    // Duplicados — mesma origem de transportUrl ou mesmo manifest.id.
    // O manifest.id do Cinemeta (com.linvo.cinemeta) fica de fora deste
    // agrupamento de propósito: o "Cinemeta PT" (Toast Translator) reporta o
    // mesmo id sem ser o Cinemeta oficial, e isso não é um duplicado — é um
    // addon à parte, tratado abaixo na detecção dedicada do Cinemeta.
    const byOrigin = new Map();
    const byManifestId = new Map();
    addons.forEach((a, i) => {
      const origin = util.urlOrigin(a.transportUrl || a.url || '');
      if (origin) {
        if (!byOrigin.has(origin)) byOrigin.set(origin, []);
        byOrigin.get(origin).push(i);
      }
      const mid = a.manifest?.id;
      if (mid && mid !== CINEMETA_MANIFEST_ID) {
        if (!byManifestId.has(mid)) byManifestId.set(mid, []);
        byManifestId.get(mid).push(i);
      }
    });
    const dupSeen = new Set();
    for (const [, idxs] of byManifestId) {
      if (idxs.length > 1) {
        idxs.forEach(i => dupSeen.add(i));
        issues.push({
          type: 'duplicado',
          severity: 'aviso',
          message: `Tens ${idxs.length} instâncias de "${addons[idxs[0]].manifest?.name || addons[idxs[0]].name || 'addon'}" — é intencional?`,
          addonIndexes: idxs,
        });
      }
    }
    for (const [, idxs] of byOrigin) {
      if (idxs.length > 1 && !idxs.some(i => dupSeen.has(i))) {
        issues.push({
          type: 'duplicado',
          severity: 'aviso',
          message: `Tens ${idxs.length} addons da mesma instância — é intencional?`,
          addonIndexes: idxs,
        });
      }
    }

    // Cinemeta oficial presente sem tratamento (nunca patchado/removido) —
    // identificado só pelo host, nunca por um addon diferente (ex. Cinemeta PT)
    // que partilhe o mesmo manifest.id ou um nome parecido.
    const cinemetaIdx = addons.findIndex(a => isOfficialCinemeta(a));
    if (cinemetaIdx !== -1) {
      issues.push({
        type: 'cinemeta',
        severity: 'info',
        message: 'O Cinemeta está instalado sem alterações — títulos e catálogos ficam em inglês. Experimenta o Cinemeta PT.',
        addonIndexes: [cinemetaIdx],
        link: '/cinemeta-pt/',
      });
    }

    // Toast "Cinemeta PT" presente — extra opcional desde a ronda 4 (ver
    // docs/estudo-quickstart-pt.md): pesquisa morta, fichas coincidem sempre
    // com as do AIOMetadata nos testes feitos, só acrescenta linhas à home.
    // Nota informativa, não aviso — não é um problema, é uma escolha.
    const toastIdx = addons.findIndex(a => (a.transportUrl || a.url || '').includes('toast-translator'));
    if (toastIdx !== -1) {
      issues.push({
        type: 'toast-opcional',
        severity: 'info',
        message: 'Opcional — acrescenta linhas do Cinemeta traduzidas à página inicial; podes removê-lo no Organizador.',
        addonIndexes: [toastIdx],
        link: '/organizador/',
      });
    }

    // Manifests que não respondem (em paralelo, com limite)
    const toCheck = addons.map((a, i) => ({ i, url: a.transportUrl || a.url })).filter(x => x.url);
    const results = new Array(addons.length);
    let cursor = 0;
    async function worker() {
      while (cursor < toCheck.length) {
        const { i, url } = toCheck[cursor++];
        results[i] = await checkManifest(url);
      }
    }
    await Promise.all(Array.from({ length: Math.min(concurrency, toCheck.length) }, worker));

    addons.forEach((a, i) => {
      const r = results[i];
      if (!r || r.ok) return;
      const name = a.manifest?.name || a.name || 'addon desconhecido';
      let message;
      if (r.kind === 'timeout' || r.kind === 'network') {
        message = `"${name}" não respondeu — pode ser bloqueio do teu operador, não necessariamente um problema do addon.`;
      } else if (r.kind === 'http') {
        message = `"${name}" devolveu erro HTTP ${r.status}.`;
      } else {
        message = `"${name}" devolveu uma resposta inválida.`;
      }
      issues.push({ type: 'manifest-offline', severity: 'erro', message, addonIndexes: [i] });
    });

    // Ordem — pack PT fora do topo (AIOMetadata devia estar perto do início)
    const aioIdx = addons.findIndex(a => (a.transportUrl || a.url || '').includes('aiometadata'));
    if (aioIdx > 2) {
      issues.push({
        type: 'ordem',
        severity: 'info',
        message: 'O AIOMetadata não está perto do topo da lista — pode não aparecer em primeiro na home.',
        addonIndexes: [aioIdx],
      });
    }

    return issues;
  }

  // Gera texto pronto a colar num post do subreddit. NUNCA inclui URLs completos,
  // query strings, chaves, authKey, email ou ID de perfil — só nome, versão,
  // manifest.id e o host (apenas se for uma instância pública conhecida).
  function sanitizeReport(addons, issues) {
    const lines = [];
    lines.push('--- Relatório da conta (gerado pelo Stremio PT) ---');
    lines.push('');
    lines.push(`Addons instalados: ${addons.length}`);
    lines.push('');
    addons.forEach(a => {
      const name = a.manifest?.name || a.name || 'desconhecido';
      const version = a.manifest?.version || '?';
      const id = a.manifest?.id || '(sem id)';
      const host = hostLabel(a.transportUrl || a.url || '');
      lines.push(`- ${name} v${version} [${id}] — ${host}`);
    });
    lines.push('');
    if (issues.length === 0) {
      lines.push('Nenhum problema detectado.');
    } else {
      lines.push('Problemas detectados:');
      issues.forEach(iss => lines.push(`- [${iss.severity}] ${iss.message}`));
    }
    lines.push('');
    lines.push('--- fim do relatório ---');
    return lines.join('\n');
  }

  global.AccountDiagnostico = { analyzeAddons, sanitizeReport, hostLabel, checkManifest, KNOWN_HOSTS };
})(window);
