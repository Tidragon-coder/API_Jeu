const mongoose = require('mongoose');

// Modele dedie aux jeux importes depuis l'API Store Steam
const steamGameSchema = new mongoose.Schema({
  steamAppId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },

  // Infos principales
  title: { type: String, required: true },
  shortDescription: String,
  longDescription: String,

  // Medias
  headerImage: String,      // grande banniere 460x215
  capsuleImage: String,     // capsule horizontale 231x87
  background: String,

  // Genres (multiples) - strings pour rester souple lors des tests
  genres: [String],

  // Prix courant (price_overview)
  price: {
    currency: String,       // ex: "EUR"
    initial: Number,        // avant promo (en cents)
    final: Number,          // apres promo (en cents)
    discountPercent: Number // pourcentage de remise
  },

  // Editeurs / publishers
  publishers: [String],

  // Date de sortie et age
  releaseDate: Date,
  requiredAge: Number,      // age requis (approx PEGI)

  // Scores
  metacriticScore: Number,  // score metacritic
  userRating: Number,       // champ libre si tu veux stocker un score calcule

}, { timestamps: true });

module.exports = mongoose.model('SteamGame', steamGameSchema);
