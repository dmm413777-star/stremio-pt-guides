// Utilitários partilhados pelas ferramentas de conta (QuickStart, Cinemeta PT,
// Diagnóstico, Organizador). Sem dependências — JS puro, sem build step.
(function (global) {
  'use strict';

  function urlOrigin(url) {
    try { return new URL(url).origin; } catch { return ''; }
  }

  function generatePassword(len) {
    len = len || 16;
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(crypto.getRandomValues(new Uint8Array(len)))
      .map(b => chars[b % chars.length])
      .join('');
  }

  function fetchTimeout(url, ms, opts) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, Object.assign({}, opts, { signal: ctrl.signal })).finally(() => clearTimeout(t));
  }

  global.AccountUtil = { urlOrigin, generatePassword, fetchTimeout };
})(window);
