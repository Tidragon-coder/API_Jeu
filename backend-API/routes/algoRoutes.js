const express = require('express');
const router = express.Router();

const algoController = require('../controllers/algoController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/gameAlgo/:id', verifyToken, algoController.getGameAlgo);

module.exports = router;