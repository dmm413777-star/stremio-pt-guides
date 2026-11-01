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
  };
})(window);
