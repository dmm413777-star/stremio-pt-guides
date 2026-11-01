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

  // --- Cinemeta Patcher ---------------------------------------------------
  // Porta fiel de CinemetaPatcherAPI em
  // https://duck-tools.pages.dev/js-bundles/cinemeta-patcher.bundle.js
  // (ferramenta em produção, creditada na página Cinemeta PT).
  const CINEMETA_URL = 'https://v3-cinemeta.strem.io/manifest.json';
  const CINEMETA_HOME_CATALOGS = new Set(['top', 'year', 'imdbRating', 'last-videos', 'calendar-videos']);

  function isCinemeta(addon) {
    if (!addon) return false;
    if (addon.manifest && addon.manifest.name === 'Cinemeta') return true;
    if (addon.transportUrl && addon.transportUrl.startsWith('https://v3-cinemeta.strem.io')) return true;
    return false;
  }

  async function fetchOfficialCinemeta() {
    const res = await util.fetchTimeout(CINEMETA_URL, 10000);
    if (!res.ok) throw new Error('Não foi possível obter o manifest oficial do Cinemeta.');
    const manifest = await res.json();
    return { transportUrl: CINEMETA_URL, transportName: 'http', flags: { official: true, protected: true }, manifest };
  }

  // options: { removeSearch, removeStandardCatalogs, removeMeta }
  function patchCinemetaManifest(addons, options) {
    const updated = JSON.parse(JSON.stringify(addons));
    const idx = updated.findIndex(a => isCinemeta(a));
    if (idx === -1) throw new Error('Cinemeta não encontrado na colecção.');

    const cinemeta = updated[idx];
    let catalogs = Array.isArray(cinemeta.manifest.catalogs) ? cinemeta.manifest.catalogs : [];
    let resources = Array.isArray(cinemeta.manifest.resources) ? cinemeta.manifest.resources : [];

    if (options.removeSearch) {
      catalogs = catalogs.filter(c => !(c && c.id === 'cinemeta.search' && (c.type === 'movie' || c.type === 'series')));
      catalogs = catalogs.map(c => {
        if (c && Array.isArray(c.extra) && c.id === 'top' && (c.type === 'movie' || c.type === 'series')) {
          c.extra = c.extra.filter(e => (typeof e === 'string' ? e : e?.name) !== 'search');
        }
        return c;
      });
      resources = resources.filter(r => (typeof r === 'string' ? r : r?.name) !== 'search');
    }

    if (options.removeStandardCatalogs) {
      const isTarget = c => c && CINEMETA_HOME_CATALOGS.has(c.id) && (c.type === 'movie' || c.type === 'series');
      if (!options.removeSearch) {
        catalogs = catalogs.map(c => {
          if (c && c.id === 'top' && (c.type === 'movie' || c.type === 'series') && Array.isArray(c.extra)) {
            c.extra = c.extra.map(e => (typeof e === 'string' ? e : e?.name) === 'search' ? { name: 'search', isRequired: true } : e);
          }
          return c;
        }).filter(c => c && !(c.id === 'year' || c.id === 'imdbRating') && (c.type === 'movie' || c.type === 'series'));
      } else {
        catalogs = catalogs.filter(c => !isTarget(c));
      }
    }

    if (options.removeMeta) {
      resources = resources.filter(r => (typeof r === 'string' ? r : r?.name) !== 'meta');
    }

    cinemeta.manifest.catalogs = catalogs;
    cinemeta.manifest.resources = resources;
    const applied = [];
    if (options.removeSearch) applied.push('pesquisa');
    if (options.removeStandardCatalogs) applied.push('catálogos da página inicial');
    if (options.removeMeta) applied.push('metadados');
    cinemeta.manifest.name = 'Cinemeta (Patched)';
    cinemeta.manifest.description = 'Patchado pelo Stremio PT. Removido: ' + applied.join(', ') + '.';

    return updated;
  }

  // Aplica o patch directamente numa conta (busca o Cinemeta oficial fresco antes
  // de patchar, para nunca patchar em cima de um patch anterior já corrompido).
  async function patchCinemeta(token, options) {
    const addons = await getAddons(token);
    const fresh = await fetchOfficialCinemeta();
    const idx = addons.findIndex(a => isCinemeta(a));
    if (idx !== -1) addons[idx] = fresh; else addons.unshift(fresh);
    const patched = patchCinemetaManifest(addons, options);
    await setAddons(patched, token);
  }

  async function resetCinemeta(token) {
    const addons = await getAddons(token);
    const fresh = await fetchOfficialCinemeta();
    const idx = addons.findIndex(a => isCinemeta(a));
    if (idx !== -1) addons[idx] = fresh; else addons.unshift(fresh);
    await setAddons(addons, token);
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
