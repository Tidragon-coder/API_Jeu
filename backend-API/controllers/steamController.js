const mongoose = require('mongoose');
const SteamGame = require('../models/SteamGame');

// GET /api/steam?page=1&limit=25
exports.getAllSteamGames = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const pageSize = Math.max(parseInt(req.query.limit, 10) || 25, 1);
    const q = (req.query.q || '').trim();

    const match = q
      ? {
          title: { $regex: q, $options: 'i' }
        }
      : {};

    const [total, games] = await Promise.all([
      SteamGame.countDocuments(match),
      SteamGame.find(match)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort({ createdAt: -1 })
    ]);

    return res.status(200).json({
      games,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
      message: 'steam games fetched successfully'
    });
  } catch (error) {
    return res.status(500).json({ message: 'error fetching steam games', error: error.message });
  }
};

// GET /api/steam/:id
// Accepts either steamAppId (number) or MongoDB ObjectId
exports.getSteamGameById = async (req, res) => {
  try {
    const { id } = req.params;
    let game = null;

    if (/^\\d+$/.test(id)) {
      game = await SteamGame.findOne({ steamAppId: Number(id) });
    }

    if (!game && mongoose.isValidObjectId(id)) {
      game = await SteamGame.findById(id);
    }

    if (!game) {
      return res.status(404).json({ message: 'steam game not found' });
    }

    return res.status(200).json({ game, message: 'steam game fetched successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'error fetching steam game', error: error.message });
  }
};
