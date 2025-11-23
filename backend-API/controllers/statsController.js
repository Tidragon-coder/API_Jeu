const Genre = require('../models/Genre');
const Game = require('../models/Game');
const Review = require('../models/Review');
const Watchlist = require('../models/GameList');
const User = require('../models/User');

exports.testOnline = async (req, res) => {
    return res.status(200).json({ message: 'Stats online endpoint hit successfully' });
};

exports.getUserStatsPerDay = async (req, res) => {
    try {
        const userStats = await User.find();
        res.status(200).json({ userStats, message: 'User stats fetched successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error getting user stats' });
    }
};