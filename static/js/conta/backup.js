// Cópia de segurança descarregável da colecção de addons — para as ferramentas
// que escrevem na conta (QuickStart, Cinemeta PT, Instalar por URL, Organizador).
// O backup em memória perde-se ao fechar o separador; isto dá uma cópia real.
(function (global) {
  'use strict';

  // `data` é normalmente uma lista de addons; algumas ferramentas (QuickStart)
  // passam { addons, passwords } para incluir as passwords AIOStreams/AIOMetadata
  // geradas na instalação.
  function downloadBackup(data, filenamePrefix) {
    const isWrapped = data && !Array.isArray(data) && Array.isArray(data.addons);
    const payload = {
      exportedAt: new Date().toISOString(),
      addons: isWrapped ? data.addons : data,
    };
    if (isWrapped && data.passwords) payload.passwords = data.passwords;
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (filenamePrefix || 'addons-backup') + '-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function readBackupFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(String(reader.result));
          const addons = Array.isArray(data) ? data : data.addons;
          if (!Array.isArray(addons)) throw new Error('Ficheiro inválido — não encontrei uma lista de addons.');
          resolve(addons);
        } catch (e) {
          reject(e instanceof Error ? e : new Error('Ficheiro inválido.'));
        }
      };
      reader.onerror = () => reject(new Error('Não foi possível ler o ficheiro.'));
      reader.readAsText(file);
    });
  }

  // HTML do bloco de backup/restauro, para injectar nas páginas das ferramentas.
  // idPrefix evita colisões de id entre ferramentas na mesma página.
  function widgetHtml(idPrefix) {
    return `
      <div style="margin-top:0.7rem;padding-top:0.7rem;border-top:1px solid var(--qs-border,#2e3450)">
        <button type="button" class="btn btn-ghost" id="${idPrefix}-btn-download" style="width:100%">💾 Transferir cópia de segurança</button>
        <div style="font-size:0.72rem;color:#f59e0b;margin-top:0.35rem;line-height:1.4">
          ⚠️ Este ficheiro contém as tuas chaves/URLs de addon. Não o partilhes.
        </div>
        <details style="margin-top:0.5rem">
          <summary style="font-size:0.78rem;cursor:pointer;color:var(--qs-text-muted,#94a3b8)">Repor de uma cópia de segurança</summary>
          <div style="margin-top:0.5rem;display:flex;gap:0.4rem;align-items:center;flex-wrap:wrap">
            <input type="file" id="${idPrefix}-inp-restore" accept="application/json" style="font-size:0.78rem;flex:1;min-width:0">
            <button type="button" class="btn btn-ghost" id="${idPrefix}-btn-restore" style="width:auto">Repor</button>
          </div>
          <div class="status-line" id="${idPrefix}-restore-status"></div>
        </details>
      </div>`;
  }

  // Liga os botões do widgetHtml. getCurrentAddons()/onRestore(addons) são
  // fornecidos pela ferramenta — cada uma sabe como ler/gravar a sua conta.
  function wireWidget(idPrefix, filenamePrefix, getCurrentAddons, onRestore) {
    const btnDownload = document.getElementById(idPrefix + '-btn-download');
    const btnRestore = document.getElementById(idPrefix + '-btn-restore');
    const inpRestore = document.getElementById(idPrefix + '-inp-restore');
    const statusEl = document.getElementById(idPrefix + '-restore-status');

    if (btnDownload) {
      btnDownload.addEventListener('click', async () => {
        btnDownload.disabled = true;
        try {
          const addons = await getCurrentAddons();
          downloadBackup(addons, filenamePrefix);
        } finally {
          btnDownload.disabled = false;
        }
      });
    }

    if (btnRestore) {
      btnRestore.addEventListener('click', async () => {
        const file = inpRestore && inpRestore.files && inpRestore.files[0];
        if (!file) {
          if (statusEl) { statusEl.className = 'status-line err'; statusEl.textContent = 'Escolhe um ficheiro de cópia de segurança primeiro.'; }
          return;
        }
        try {
          const addons = await readBackupFile(file);
          if (!confirm('Repor ' + addons.length + ' addon(s) desta cópia de segurança? Isto substitui a lista actual na tua conta.')) return;
          if (statusEl) { statusEl.className = 'status-line'; statusEl.textContent = 'A repor…'; }
          await onRestore(addons);
          if (statusEl) { statusEl.className = 'status-line ok'; statusEl.textContent = '✓ Reposto.'; }
        } catch (err) {
          if (statusEl) { statusEl.className = 'status-line err'; statusEl.textContent = err.message || 'Erro ao repor.'; }
        }
      });
    }
  }

  global.AccountBackup = { downloadBackup, readBackupFile, widgetHtml, wireWidget };
})(window);
