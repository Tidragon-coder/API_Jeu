/**
 * Telecharge la liste complete des appids Steam et la sauvegarde en JSON.
 *
 * - Commande: `node scripts/downloadSteamAppIds.js`
 * - Variables d'env:
 *   - STEAM_APPIDS_PATH (optionnel) : chemin de sortie.
 *   - STEAM_API_KEY (optionnel) : si présent, utilise l'API officielle IStoreService (pagination).
 */
const fs = require('fs/promises');
const path = require('path');

const STORE_SERVICE_URL = 'https://api.steampowered.com/IStoreService/GetAppList/v1/';
const FALLBACK_URL = 'https://raw.githubusercontent.com/dgibbs64/SteamCMD-AppID-List/master/steamcmd_appid.json';
const OUTPUT_PATH = process.env.STEAM_APPIDS_PATH || path.join(__dirname, 'steamAppIds.json');

async function fetchFromStoreService() {
  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey) return null;

  const maxResults = 50000;
  const paramsBase =
    `key=${apiKey}&max_results=${maxResults}&include_games=true&include_dlc=true&include_software=true&include_videos=true&include_hardware=true`;

  let lastAppId = 0;
  const apps = [];

  while (true) {
    const url = `${STORE_SERVICE_URL}?${paramsBase}&last_appid=${lastAppId}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`StoreService HTTP ${res.status}`);
    }
    const json = await res.json();
    const chunk = json?.response?.apps || [];
    apps.push(...chunk);
    const haveMore = Boolean(json?.response?.have_more_results);
    lastAppId = json?.response?.last_appid ?? 0;
    if (!haveMore || chunk.length === 0) break;
  }

  return apps.filter((a) => Number.isInteger(a.appid) && a.appid > 0);
}

async function fetchFromFallback() {
  const res = await fetch(FALLBACK_URL);
  if (!res.ok) {
    throw new Error(`Fallback HTTP ${res.status}`);
  }
  const json = await res.json();
  const apps = json?.applist?.apps;
  if (!Array.isArray(apps)) {
    throw new Error('Unexpected fallback response shape');
  }
  return apps.filter((a) => Number.isInteger(a.appid) && a.appid > 0);
}

async function fetchAppList() {
  // 1) Essai API officielle si clé fournie
  const apiResult = await fetchFromStoreService();
  if (apiResult && apiResult.length) {
    console.log(`Fetched ${apiResult.length} appids via Steam Web API (IStoreService).`);
    return apiResult;
  }

  // 2) Fallback dataset GitHub (mis à jour régulièrement)
  console.warn('STEAM_API_KEY absent ou API Steam indisponible, fallback GitHub.');
  return fetchFromFallback();
}

async function saveJson(apps) {
  const payload = {
    generatedAt: new Date().toISOString(),
    total: apps.length,
    apps
  };
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(payload, null, 2), 'utf8');
}

async function main() {
  console.log('Fetching full Steam app list...');
  const apps = await fetchAppList();
  console.log(`Fetched ${apps.length} entries. Writing to ${OUTPUT_PATH} ...`);
  await saveJson(apps);
  console.log('Done.');
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
