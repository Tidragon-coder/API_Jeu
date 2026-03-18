/**
 * Supprime tous les documents de la collection SteamGame.
 *
 * Commande: `node scripts/clearSteamGames.js`
 */
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const SteamGame = require('../models/SteamGame');

async function main() {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    throw new Error('MONGO_URL manquant dans .env');
  }

  await mongoose.connect(mongoUrl);
  const res = await SteamGame.deleteMany({});
  await mongoose.disconnect();
  console.log(`Suppression terminée : ${res.deletedCount} documents retirés.`);
}

main().catch((err) => {
  console.error('Erreur:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
