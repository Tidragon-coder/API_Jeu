const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');
const gameController = require('../controllers/gameController');
const reviewController = require('../controllers/reviewController');
const gamelistController = require('../controllers/gamelistController');

const verifyToken = require('../middlewares/verifyToken');


// Route privé (JWT obligatoire)
//genre 
router.post('/genre/new', verifyToken, genreController.createGenre);
router.get('/genres', verifyToken, genreController.getAllGenres);
router.get('/genre/:id', verifyToken, genreController.getGenreById);
router.put('/genre/:id', verifyToken, genreController.updateGenre);
router.delete('/genre/:id', verifyToken, genreController.deleteGenre);

//game
router.post('/new', verifyToken, gameController.createGame);
router.get('/games/all', verifyToken, gameController.getAllGames);
router.get('/game/:id', verifyToken, gameController.getGameById);
router.put('/game/:id', verifyToken, gameController.updateGame);
router.delete('/game/:id', verifyToken, gameController.deleteGame);

//review
router.post('/review/new', verifyToken, reviewController.createReview);
router.get('/reviews', verifyToken, reviewController.getAllReviews);

//watchlist
router.post('/gamelist/new', verifyToken, gamelistController.createGamelist);



// router.get('/:id', verifyToken, movieController.getUserById);
// router.put('/:id', verifyToken, movieController.updateUser);
// router.delete('/:id', verifyToken, movieController.deleteUser);
// router.post('/logout', movieController.logoutUser);


module.exports = router;