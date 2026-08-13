/**
 * Cloudflare Worker — proxy CORS para AIOStreams e SubMaker
 *
 * AIOStreams /api/v1/user e SubMaker /api/create-session não têm CORS headers.
 * O browser bloqueia chamadas directas. Este Worker faz as chamadas server-to-server
 * e devolve o resultado com os headers CORS correctos.
 */

const ALLOWED_INSTANCES = [
  'https://aiostreamsfortheweebs.midnightignite.me',
  'https://aiostreams-nightly.fortheweak.cloud',
  'https://aiostreams.viren070.me',
  'https://aiostreams-nightly.206111.xyz',
];

const SUBMAKER_URL = 'https://submaker.elfhosted.com';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

async function handleAIOStreams(body) {
  const { instance, config, password } = body;

  if (!instance || !config || !password) {
    return jsonResponse({ success: false, error: 'Missing instance, config or password' }, 400);
  }

  if (!ALLOWED_INSTANCES.includes(instance)) {
    return jsonResponse({ success: false, error: 'Instance not allowed' }, 403);
  }

  let aioRes;
  try {
    aioRes = await fetch(`${instance}/api/v1/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config, password }),
    });
  } catch (err) {
    return jsonResponse({ success: false, error: `Instance unreachable: ${err.message}` }, 502);
  }

  const data = await aioRes.json();

  if (data.success && data.data?.uuid && data.data?.encryptedPassword) {
    const { uuid, encryptedPassword } = data.data;
    data.data.manifestUrl = `${instance}/stremio/${uuid}/${encryptedPassword}/manifest.json`;
  }

  return jsonResponse(data, aioRes.status);
}

async function handleSubMaker(body) {
  const { config } = body;

  if (!config) {
    return jsonResponse({ success: false, error: 'Missing config' }, 400);
  }

  let smRes;
  try {
    smRes = await fetch(`${SUBMAKER_URL}/api/create-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
  } catch (err) {
    return jsonResponse({ success: false, error: `SubMaker unreachable: ${err.message}` }, 502);
  }

  const data = await smRes.json();

  if (smRes.ok && data.token) {
    return jsonResponse({
      success: true,
      token: data.token,
      manifestUrl: `${SUBMAKER_URL}/addon/${data.token}/manifest.json`,
    });
  }

  return jsonResponse({ success: false, error: data.error || `HTTP ${smRes.status}` }, smRes.status);
}

export default {
  async fetch(request) {
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
      return jsonResponse({ success: false, error: 'Invalid JSON' }, 400);
    }

    const service = body.service || 'aiostreams';

    if (service === 'submaker') {
      return handleSubMaker(body);
    }

    return handleAIOStreams(body);
  },
};
