const express = require('express');
const router = express.Router();

const statsController = require('../controllers/statsController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/online', verifyToken, statsController.testOnline);
router.get('/user-stats/QperDay', verifyToken, statsController.getUserStatsPerDay);// quatity per day

module.exports = router;