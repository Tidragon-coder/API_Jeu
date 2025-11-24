const Genre = require('../models/Genre');
const Game = require('../models/Game');
const Review = require('../models/Review');
const Watchlist = require('../models/GameList');
const User = require('../models/User');

exports.testOnline = async (req, res) => {
    return res.status(200).json({ message: 'Stats online endpoint hit successfully' });
};

exports.getUserStatsPerDay = async (req, res) => { // calcul du nombre d'utilisateur par semaines pendant x semaines données 
    let weeks = 6 // nombre de semines ici, peut etre pouvoir le deffinir dans la requette API plus tard 
    const results = []
    
    try {
    for (let w=1; w <= weeks; w++) {
        const start = getDateWeeksAgo(w)
        const end = getDateWeeksAgo(w-1)

        const count = await User.countDocuments({ createdAt: {$gte: start, $lt: end}})
        results.push(count)
    }
    results.reverse()
    const dateNow = new Date()
        res.status(200).json({ results, message: 'User stats fetched successfully', dateNow });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error getting user stats' });
    }
};


const getDateWeeksAgo = (weeks) => {
    const date = new Date()
    date.setDate(date.getDate() - (weeks * 7))
    return date
}