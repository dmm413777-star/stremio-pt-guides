// Adaptador Stremio — módulo partilhado pelas ferramentas de conta.
// Requer AccountUtil (util.js) carregado antes deste ficheiro.
(function (global) {
  'use strict';

  const util = global.AccountUtil;

  const STREMIO_API = 'https://api.strem.io/api';

  // Cria um manifest "slim" para evitar "max descriptor size reached" E garantir que
  // o parser Rust do Stremio desktop não falha com manifest:null.
  // Mantém os catalogs (necessários para a homepage mostrar rows de conteúdo) mas
  // remove o campo "extra" de géneros de cada catálogo (maior parte do tamanho) —
  // preserva "search"/"skip" porque removê-los parte a pesquisa do Stremio.
  function makeSlimManifest(m) {
    if (!m) return null;
    const slimCatalogs = (m.catalogs || []).map(c => {
      const slimExtra = (c.extra || []).filter(e => e.name !== 'genre');
      const cat = { type: c.type, id: c.id, name: c.name };
      if (slimExtra.length) cat.extra = slimExtra;
      return cat;
    });
    return {
      id: m.id,
      version: m.version || '0.0.1',
      name: m.name,
      description: m.description || '',
      logo: m.logo || undefined,
      resources: m.resources || [],
      types: m.types || [],
      catalogs: slimCatalogs,
      behaviorHints: m.behaviorHints || undefined,
    };
  }

  async function login(email, password) {
    const res = await fetch(`${STREMIO_API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, facebook: false }),
    });
    if (!res.ok) throw new Error('Servidor indisponível (HTTP ' + res.status + ')');
    const data = await res.json();
    if (!data.result || !data.result.authKey) {
      const errVal = data.error;
      const errMsg = (typeof errVal === 'string' && errVal) ? errVal
        : (errVal?.message || errVal?.error || 'E-mail ou password incorretos.');
      throw new Error(errMsg);
    }
    return data.result.authKey;
  }

  async function register(email, password) {
    const res = await util.fetchTimeout(`${STREMIO_API}/register`, 8000, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, confirmPassword: password, facebook: false }),
    });
    if (!res.ok) throw new Error('Servidor indisponível (HTTP ' + res.status + ')');
    const data = await res.json();
    if (!data.result?.authKey) {
      const errVal = data.error;
      const msg = (typeof errVal === 'string' && errVal) ? errVal : (errVal?.message || 'Não foi possível criar a conta.');
      throw new Error(msg);
    }
    return data.result.authKey;
  }

  // Stremio não tem perfis — devolve um perfil virtual único para manter a
  // interface comum com o Nuvio (quem chama pode ignorar profileId para Stremio).
  async function getProfiles() {
    return [{ id: null, name: null }];
  }

  async function getAddons(token) {
    const res = await util.fetchTimeout(`${STREMIO_API}/addonCollectionGet`, 10000, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authKey: token, type: 'User' }),
    });
    if (!res.ok) throw new Error('Erro ao ler addons da conta.');
    const data = await res.json();
    return data.result?.addons ?? [];
  }

  // Substituição total da colecção. Busca manifests em falta (addons vindos do
  // addonCollectionGet às vezes têm manifest:null) e aplica o slim manifest a todos.
  async function setAddons(addons, token) {
    const withManifests = await Promise.all(addons.map(async a => {
      if (a.manifest) return a;
      try {
        const r = await util.fetchTimeout(a.transportUrl, 5000);
        if (r.ok) return { ...a, manifest: await r.json() };
      } catch {}
      return a;
    }));

    const slim = withManifests.map(a => ({
      transportUrl: a.transportUrl,
      transportName: a.transportName || 'http',
      flags: a.flags || {},
      manifest: makeSlimManifest(a.manifest),
    }));

    const res = await fetch(`${STREMIO_API}/addonCollectionSet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authKey: token, addons: slim }),
    });
    if (!res.ok) throw new Error('Erro ao guardar na conta Stremio (HTTP ' + res.status + ')');
    const data = await res.json();
    if (data.error) throw new Error(typeof data.error === 'object' ? data.error.message || JSON.stringify(data.error) : data.error);
    return data;
  }

  async function backup(token) {
    return getAddons(token);
  }

  async function restore(backupData, token) {
    return setAddons(backupData, token);
  }

  // --- Cinemeta Patcher -----------------------------------------------------
  // Implementação própria. A ideia (esconder/remover partes do Cinemeta editando
  // o manifest guardado na colecção) foi inspirada no Cinemeta Patcher do
  // duck-tools.pages.dev — creditado na página Cinemeta PT — mas o código abaixo
  // foi escrito de raiz a partir da especificação (o que cada opção faz ao
  // manifest), não copiado do bundle deles: sem licença permissiva publicada,
  // só a técnica foi reaproveitada, não a expressão do código.
  const CINEMETA_URL = 'https://v3-cinemeta.strem.io/manifest.json';
  const CINEMETA_OFFICIAL_HOST = 'v3-cinemeta.strem.io';
  // Catálogos que populam a página inicial do Cinemeta (não a pesquisa).
  const CINEMETA_HOME_CATALOG_IDS = ['top', 'year', 'imdbRating', 'last-videos', 'calendar-videos'];
  const CINEMETA_SEARCH_CATALOG_ID = 'cinemeta.search';

  // Identifica o Cinemeta oficial só pelo host do transportUrl — nunca pelo
  // manifest.id nem pelo nome, porque outros addons (ex. o "Cinemeta PT" do
  // Toast Translator) podem legitimamente reportar o mesmo id ou um nome parecido
  // sem serem o addon oficial.
  function isCinemeta(addon) {
    const url = addon && (addon.transportUrl || addon.url);
    if (!url) return false;
    try { return new URL(url).host === CINEMETA_OFFICIAL_HOST; } catch { return false; }
  }

  async function fetchOfficialCinemeta() {
    const res = await util.fetchTimeout(CINEMETA_URL, 10000);
    if (!res.ok) throw new Error('Não foi possível obter o manifest oficial do Cinemeta.');
    const manifest = await res.json();
    return { transportUrl: CINEMETA_URL, transportName: 'http', flags: { official: true, protected: true }, manifest };
  }

  function extraNameOf(entry) { return typeof entry === 'string' ? entry : entry?.name; }
  function dropExtra(extraList, name) {
    return Array.isArray(extraList) ? extraList.filter(e => extraNameOf(e) !== name) : extraList;
  }
  function requireExtra(extraList, name) {
    if (!Array.isArray(extraList)) return extraList;
    return extraList.map(e => extraNameOf(e) === name ? { name, isRequired: true } : e);
  }
  function isMovieOrSeriesCatalog(c) { return !!c && (c.type === 'movie' || c.type === 'series'); }

  // Constrói um manifest novo (não muta o original) com as três opções
  // independentes aplicadas. "removeSearch" e "removeStandardCatalogs" podem
  // ser combinadas de qualquer forma.
  function buildPatchedCinemetaManifest(manifest, options) {
    let catalogs = (manifest.catalogs || []).map(c => ({ ...c }));
    let resources = [...(manifest.resources || [])];

    if (options.removeSearch) {
      // tira o catálogo de pesquisa dedicado, se existir, e a capacidade de
      // pesquisar através do catálogo "top"
      catalogs = catalogs
        .filter(c => !(isMovieOrSeriesCatalog(c) && c.id === CINEMETA_SEARCH_CATALOG_ID))
        .map(c => (isMovieOrSeriesCatalog(c) && c.id === 'top') ? { ...c, extra: dropExtra(c.extra, 'search') } : c);
      resources = resources.filter(r => extraNameOf(r) !== 'search');
    }

    if (options.removeStandardCatalogs) {
      const isHomeCatalog = c => isMovieOrSeriesCatalog(c) && CINEMETA_HOME_CATALOG_IDS.includes(c.id);
      if (options.removeSearch) {
        // sem pesquisa, não há razão para manter nenhuma fila da home
        catalogs = catalogs.filter(c => !isHomeCatalog(c));
      } else {
        // a pesquisa continua a viver no catálogo "top" — mantém-se só esse,
        // mas força-se o extra "search" a obrigatório para que o Stremio pare
        // de o oferecer como fila da home (só responde quando há uma pesquisa)
        catalogs = catalogs
          .filter(c => !(isHomeCatalog(c) && c.id !== 'top'))
          .map(c => (isMovieOrSeriesCatalog(c) && c.id === 'top') ? { ...c, extra: requireExtra(c.extra, 'search') } : c);
      }
    }

    if (options.removeMeta) {
      resources = resources.filter(r => extraNameOf(r) !== 'meta');
    }

    const removedParts = [];
    if (options.removeSearch) removedParts.push('pesquisa');
    if (options.removeStandardCatalogs) removedParts.push('catálogos da página inicial');
    if (options.removeMeta) removedParts.push('metadados');

    return {
      ...manifest,
      catalogs,
      resources,
      name: 'Cinemeta (Patched)',
      description: 'Patchado pelo Stremio PT. Removido: ' + removedParts.join(', ') + '.',
    };
  }

  // Garante que a colecção tem sempre um Cinemeta oficial fresco na posição
  // correcta antes de aplicar qualquer alteração — nunca reaplica por cima de
  // um patch anterior já guardado.
  async function replaceCinemetaWithFreshCopy(addons) {
    const fresh = await fetchOfficialCinemeta();
    const existingIdx = addons.findIndex(a => isCinemeta(a));
    const next = [...addons];
    if (existingIdx !== -1) next[existingIdx] = fresh; else next.unshift(fresh);
    return { list: next, index: existingIdx !== -1 ? existingIdx : 0 };
  }

  async function patchCinemeta(token, options) {
    const current = await getAddons(token);
    const { list, index } = await replaceCinemetaWithFreshCopy(current);
    list[index] = { ...list[index], manifest: buildPatchedCinemetaManifest(list[index].manifest, options) };
    await setAddons(list, token);
  }

  async function resetCinemeta(token) {
    const current = await getAddons(token);
    const { list } = await replaceCinemetaWithFreshCopy(current);
    await setAddons(list, token);
  }

  global.StremioAccountAPI = {
    capabilities: {
      multipleProfiles: false,
      manifestPatch: true,   // addonCollectionSet aceita qualquer manifest para qualquer transportUrl
      reorder: true,         // a ordem do array É a ordem guardada
      remove: true,
    },
    login,
    register,
    getProfiles,
    getAddons,
    setAddons,
    backup,
    restore,
    makeSlimManifest,
    isCinemeta,
    fetchOfficialCinemeta,
    patchCinemeta,
    resetCinemeta,
  };
})(window);
