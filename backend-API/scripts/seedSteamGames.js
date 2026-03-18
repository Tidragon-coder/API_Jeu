/**
 * Seed de 20 jeux Steam dans la collection SteamGame.
 *
 * - Ne lance pas ce fichier automatiquement : exécution manuelle
 *   via `node scripts/seedSteamGames.js` (ou `docker compose run --rm node node scripts/seedSteamGames.js`)
 * - Utilise l'API publique du Store Steam (non officielle, pas de clé).
 * - Upsert (insert ou update) pour éviter les doublons sur steamAppId.
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const SteamGame = require('../models/SteamGame');
const fs = require('fs/promises');
const path = require('path');

// Lit la liste des appids générée par downloadSteamAppIds.js
// Variables d'env :
//  - STEAM_APPIDS_PATH (optionnel) : chemin du JSON. Par défaut scripts/steamAppIds.json
//  - SEED_LIMIT (optionnel)        : nombre de jeux à prendre (défaut: 100)
async function loadAppIds() {
  const appIdsPath = process.env.STEAM_APPIDS_PATH || path.join(__dirname, 'steamAppIds.json');
  const limit = Number(process.env.SEED_LIMIT || 100);

  const raw = await fs.readFile(appIdsPath, 'utf8');
  const parsed = JSON.parse(raw);
  const apps = parsed?.apps || parsed?.applist?.apps;
  if (!Array.isArray(apps) || apps.length === 0) {
    throw new Error(`Fichier appids invalide ou vide: ${appIdsPath}`);
  }

  return apps
    .slice(0, limit)
    .map((a) => Number(a.appid))
    .filter((id) => Number.isInteger(id) && id > 0);
}

// Helper pour retirer le HTML basique de about_the_game (très simplifié)
const stripHtml = (html) => html ? html.replace(/<[^>]*>/g, '') : undefined;

async function fetchOne(appid) {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=FR&l=fr&filters=basic,price_overview,release_date,genres,short_description,about_the_game,background,header_image,metacritic,publishers`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} on appid ${appid}`);
  const json = await res.json();
  const payload = json?.[appid];
  if (!payload?.success) throw new Error(`Steam renvoie success=false pour ${appid}`);

  const data = payload.data;

  return {
    steamAppId: appid,
    title: data.name,
    shortDescription: data.short_description,
    longDescription: stripHtml(data.about_the_game),
    headerImage: data.header_image,
    capsuleImage: data.capsule_image || undefined,
    background: data.background,
    genres: data.genres?.map((g) => g.description) || [],
    price: data.price_overview
      ? {
          currency: data.price_overview.currency,
          initial: data.price_overview.initial,
          final: data.price_overview.final,
          discountPercent: data.price_overview.discount_percent,
        }
      : undefined,
    publishers: data.publishers || [],
    releaseDate: data.release_date?.date ? new Date(data.release_date.date) : undefined,
    requiredAge: data.required_age ? Number(data.required_age) : undefined,
    metacriticScore: data.metacritic?.score,
  };
}

async function main() {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    throw new Error('MONGO_URL manquant dans .env');
  }

  await mongoose.connect(mongoUrl);
  console.log('MongoDB connecté');

  const APPIDS = await loadAppIds();
  console.log(`Import des ${APPIDS.length} premiers appids depuis steamAppIds.json`);

  for (const appid of APPIDS) {
    try {
      const doc = await fetchOne(appid);
      await SteamGame.findOneAndUpdate(
        { steamAppId: appid },
        doc,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`✔︎ ${appid} - ${doc.title}`);
    } catch (err) {
      console.warn(`✖ ${appid} : ${err.message}`);
    }
  }

  await mongoose.disconnect();
  console.log('Terminé, connexion Mongo fermée');
}

main().catch((err) => {
  console.error('Erreur fatale:', err);
  mongoose.disconnect();
  process.exit(1);
});
