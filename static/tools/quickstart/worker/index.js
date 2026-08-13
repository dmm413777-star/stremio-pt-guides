/**
 * Cloudflare Worker — proxy CORS para AIOStreams /api/v1/user
 * Deploy: https://dash.cloudflare.com → Workers → Create → colar este código
 *
 * Porquê: AIOStreams /api/v1/user não tem CORS headers.
 * O browser bloqueia chamadas directas. Este Worker faz a chamada server-to-server
 * e devolve o resultado com os headers CORS correctos.
 */

const ALLOWED_INSTANCES = [
  'https://aiostreamsfortheweebs.midnightignite.me',
  'https://aiostreams-nightly.fortheweak.cloud',
  'https://aiostreams.viren070.me',
  'https://aiostreams-nightly.206111.xyz',
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request) {
    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: CORS_HEADERS });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
        status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const { instance, config, password } = body;

    if (!instance || !config || !password) {
      return new Response(JSON.stringify({ success: false, error: 'Missing instance, config or password' }), {
        status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Validar instância permitida
    if (!ALLOWED_INSTANCES.includes(instance)) {
      return new Response(JSON.stringify({ success: false, error: 'Instance not allowed' }), {
        status: 403, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Chamar AIOStreams API (server-to-server, sem restrição CORS)
    let aioRes;
    try {
      aioRes = await fetch(`${instance}/api/v1/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, password }),
      });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: `Instance unreachable: ${err.message}` }), {
        status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const data = await aioRes.json();

    // Construir manifestUrl se sucesso
    if (data.success && data.data?.uuid && data.data?.encryptedPassword) {
      const { uuid, encryptedPassword } = data.data;
      data.data.manifestUrl = `${instance}/stremio/${uuid}/${encryptedPassword}/manifest.json`;
    }

    return new Response(JSON.stringify(data), {
      status: aioRes.status,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  },
};
