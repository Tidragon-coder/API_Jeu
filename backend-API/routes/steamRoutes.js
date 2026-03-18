const express = require('express');
const router = express.Router();
const { getAllSteamGames, getSteamGameById } = require('../controllers/steamController');

// GET all steam games
router.get('/', getAllSteamGames);

// GET steam game by steamAppId or Mongo _id
router.get('/:id', getSteamGameById);

module.exports = router;
