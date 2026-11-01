// Adaptador Nuvio — módulo partilhado pelas ferramentas de conta.
// Porta fiel da implementação pública em
// https://duck-tools.pages.dev/js-bundles/quackstart.bundle.js (NuvioAPIProvider).
// Requer AccountUtil (util.js) carregado antes deste ficheiro.
(function (global) {
  'use strict';

  const util = global.AccountUtil;

  const PUBLISHABLE_KEY = 'sb_publishable_1Clq8rlTVACkdcZuqr6_AD__xUUC_EN';
  const AUTH_URL = 'https://api.nuvio.tv/auth/v1';
  const REST_URL = 'https://api.nuvio.tv/rest/v1';

  async function call(baseUrl, endpoint, method, body, token) {
    const headers = { 'Content-Type': 'application/json', apikey: PUBLISHABLE_KEY };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const res = await util.fetchTimeout(baseUrl + endpoint, 12000, {
      method, headers, body: body ? JSON.stringify(body) : undefined,
    });
    let json = {};
    try { json = await res.json(); } catch {}
    if (json?.error) throw new Error(json.error.message || json.error_description || JSON.stringify(json.error));
    if (json?.code && json?.message && typeof json.code === 'string') throw new Error(json.message);
    if (json?.msg && typeof json.code === 'number') throw new Error(json.msg);
    if (!res.ok) throw new Error('Erro Nuvio (HTTP ' + res.status + ')');
    return json;
  }

  async function login(email, password) {
    const data = await call(AUTH_URL, '/token?grant_type=password', 'POST', { email, password });
    if (!data.access_token) throw new Error('Login falhou — sem access token.');
    return data.access_token;
  }

  async function register(email, password) {
    await call(AUTH_URL, '/signup', 'POST', { email, password });
  }

  async function getProfiles(token) {
    try {
      const data = await call(REST_URL, '/rpc/sync_pull_profiles', 'POST', {}, token);
      return (Array.isArray(data) ? data : []).map(p => ({ ...p, id: p.profile_index }));
    } catch { return []; }
  }

  async function setProfiles(profiles, token) {
    const formatted = profiles.map((p, i) => ({ ...p, profile_index: parseInt(p.profile_index || (i + 1), 10) }));
    await call(REST_URL, '/rpc/sync_push_profiles', 'POST', { p_client_max_profiles: 6, p_profiles: formatted }, token);
  }

  async function ensureRealProfiles(token) {
    let profiles = await getProfiles(token);
    if (profiles.length === 0) {
      await setProfiles([{ profile_index: 1, name: 'Main', avatar_url: '' }], token);
      profiles = await getProfiles(token);
    }
    return profiles;
  }

  async function getAddons(token, profileId) {
    const data = await call(REST_URL, `/addons?select=*&profile_id=eq.${profileId}&order=sort_order`, 'GET', null, token);
    return (Array.isArray(data) ? data : []).map(item => ({ ...item, transportUrl: item.url }));
  }

  // Substituição total da colecção DESSE PERFIL. A tabela addons só guarda
  // url/name/enabled/sort_order — sem manifest persistido, sem limite de tamanho.
  async function setAddons(addons, token, profileId) {
    const formatted = addons.map((a, i) => ({
      url: a.url || a.transportUrl,
      name: a.name || a.manifest?.name || 'Addon',
      enabled: a.enabled !== false,
      sort_order: i,
    }));
    await call(REST_URL, '/rpc/sync_push_addons', 'POST', { p_profile_id: parseInt(profileId, 10), p_addons: formatted }, token);
  }

  async function backup(token, profileId) {
    return getAddons(token, profileId);
  }

  async function restore(backupData, token, profileId) {
    return setAddons(backupData, token, profileId);
  }

  // Esconde (ou mostra) os catálogos de home do Cinemeta para um perfil+plataforma.
  // Só afecta a HOME — o Nuvio não tem equivalente para a pesquisa, é limitação
  // confirmada da plataforma, não omissão nossa (ver docs/estudo-duck-tools.md).
  async function pullHomeCatalogSettings(token, profileId, platform) {
    try {
      const data = await call(REST_URL, '/rpc/sync_pull_home_catalog_settings', 'POST',
        { p_profile_id: parseInt(profileId, 10), p_platform: platform }, token);
      if (Array.isArray(data)) return data;
      if (data?.items && Array.isArray(data.items)) return data.items;
      return [];
    } catch { return []; }
  }

  async function pushHomeCatalogSettings(token, profileId, platform, items) {
    await call(REST_URL, '/rpc/sync_push_home_catalog_settings', 'POST',
      { p_profile_id: parseInt(profileId, 10), p_platform: platform, p_settings_json: { items } }, token);
  }

  global.NuvioAccountAPI = {
    capabilities: {
      multipleProfiles: true,
      manifestPatch: false,  // sem manifest persistido — não há onde guardar uma versão alterada
      reorder: true,         // sort_order calculado do índice do array
      remove: true,
    },
    login,
    register,
    getProfiles,
    setProfiles,
    ensureRealProfiles,
    getAddons,
    setAddons,
    backup,
    restore,
    pullHomeCatalogSettings,
    pushHomeCatalogSettings,
  };
})(window);
