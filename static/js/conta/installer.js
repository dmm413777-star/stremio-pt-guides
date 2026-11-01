// Instalar addon por URL — validação partilhada pela página /instalar-addon/
// e por qualquer botão "Instalar na minha conta" nos guias.
(function (global) {
  'use strict';

  const util = global.AccountUtil;

  // Aceita https://.../manifest.json e converte stremio:// para https://.
  // Recusa tudo o resto (http simples, outros esquemas). Tudo corre no browser
  // do utilizador — o pedido ao manifest parte do próprio browser, não do nosso
  // servidor, por isso não há risco de SSRF do nosso lado.
  function normalizeManifestUrl(input) {
    let url = (input || '').trim();
    if (!url) return { ok: false, error: 'Cola o URL do manifest do addon.' };
    if (url.startsWith('stremio://')) url = 'https://' + url.slice('stremio://'.length);
    if (!url.startsWith('https://')) return { ok: false, error: 'O URL tem de começar por https:// (ou stremio://).' };
    try { new URL(url); } catch { return { ok: false, error: 'URL inválido.' }; }
    return { ok: true, url };
  }

  function validateManifest(manifest) {
    if (!manifest || typeof manifest !== 'object') return { ok: false, error: 'Resposta inválida do addon.' };
    if (!manifest.id || !manifest.version || !manifest.name) {
      return { ok: false, error: 'O manifest não tem id/version/name — não parece ser um addon Stremio válido.' };
    }
    if (!Array.isArray(manifest.resources)) {
      return { ok: false, error: 'O manifest não declara "resources" — não parece ser um addon Stremio válido.' };
    }
    return { ok: true };
  }

  async function fetchAndValidateManifest(url) {
    let res;
    try {
      res = await util.fetchTimeout(url, 10000);
    } catch {
      return { ok: false, error: 'Não foi possível ligar a este addon.' };
    }
    if (!res.ok) return { ok: false, error: 'O addon devolveu erro HTTP ' + res.status + '.' };
    let manifest;
    try { manifest = await res.json(); } catch { return { ok: false, error: 'Resposta inválida do addon (não é JSON).' }; }
    const check = validateManifest(manifest);
    if (!check.ok) return check;
    return { ok: true, manifest };
  }

  global.AddonInstaller = { normalizeManifestUrl, validateManifest, fetchAndValidateManifest };
})(window);
