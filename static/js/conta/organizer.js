// Organizador de addons — ordem recomendada, reordenar, remover.
// Requer AccountUtil (util.js) carregado antes deste ficheiro.
(function (global) {
  'use strict';

  const CINEMETA_OFFICIAL_HOST = 'v3-cinemeta.strem.io';

  function isOfficialCinemeta(addon) {
    const url = addon && (addon.transportUrl || addon.url);
    if (!url) return false;
    try { return new URL(url).host === CINEMETA_OFFICIAL_HOST; } catch { return false; }
  }

  // Heurística de prioridade para a "Ordem recomendada" do pack PT. Baseada no
  // que o item 2 (docs/relatorio-ronda2.md) confirmou: o AIOMetadata PT deve
  // vir primeiro (é a fonte principal de metadados/catálogos), o Cinemeta
  // oficial deve ficar por último (só serve de fallback, e é parcialmente
  // redundante com o AIOMetadata e com o próprio Cinemeta PT/Toast Translator).
  function rankOf(addon) {
    const id = addon.manifest?.id || '';
    const name = (addon.manifest?.name || addon.name || '').toLowerCase();
    const url = (addon.transportUrl || addon.url || '').toLowerCase();

    if (isOfficialCinemeta(addon)) return 9; // sempre por último
    if (id === 'aio-metadata' || url.includes('aiometadata')) return 0;
    if (url.includes('aiostreams')) return 1;
    if (id === 'com.stremio.submaker' || url.includes('submaker')) return 2;
    if (url.includes('toast-translator')) return 3; // Cinemeta PT — depois do AIOMetadata
    if (name.includes('opensubtitles')) return 7;
    return 5; // addons de catálogo comunitários e outros, no meio
  }

  // Ordena por prioridade, mas estável: addons com o mesmo rank mantêm a
  // ordem relativa que já tinham.
  function recommendedOrder(addons) {
    return addons
      .map((a, i) => ({ a, i, r: rankOf(a) }))
      .sort((x, y) => (x.r - y.r) || (x.i - y.i))
      .map(x => x.a);
  }

  function moveUp(addons, index) {
    if (index <= 0) return addons;
    const next = [...addons];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    return next;
  }

  function moveDown(addons, index) {
    if (index >= addons.length - 1) return addons;
    const next = [...addons];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    return next;
  }

  function removeAt(addons, index) {
    return addons.filter((_, i) => i !== index);
  }

  global.AddonOrganizer = { recommendedOrder, moveUp, moveDown, removeAt, isOfficialCinemeta, rankOf };
})(window);
