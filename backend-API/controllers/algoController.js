const Game = require('../models/Game');


exports.getGameAlgo = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id).populate('genre');
        const id = game.genre.id
        const GameGenre = await Game.find({ genre: id, _id: { $ne: req.params.id } });
        
        res.status(200).json({ GameGenre, message: 'Game get successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error get game' });
    }
};