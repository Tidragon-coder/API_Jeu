const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');
const gameController = require('../controllers/gameController');
const reviewController = require('../controllers/reviewController');
const gamelistController = require('../controllers/gamelistController');

const verifyToken = require('../middlewares/verifyToken');
const { authorizeRole } = require('../middlewares/authorizeRole');


// Route privé (JWT obligatoire)
//genre 
router.post('/genre/new', verifyToken, authorizeRole('admin'), genreController.createGenre);
router.get('/genres', verifyToken, genreController.getAllGenres);
router.get('/genre/:id', verifyToken, genreController.getGenreById);
router.put('/genre/:id', verifyToken, authorizeRole('admin'), genreController.updateGenre);
router.delete('/genre/:id', verifyToken, authorizeRole('admin'), genreController.deleteGenre);

//game
router.post('/new', verifyToken, authorizeRole('admin'), gameController.createGame);
router.get('/games/all', verifyToken, gameController.getAllGames);
router.get('/game/:id', verifyToken, gameController.getGameById);
router.put('/game/:id', verifyToken, authorizeRole('admin'), gameController.updateGame);
router.delete('/game/:id', verifyToken, authorizeRole('admin'), gameController.deleteGame);

//review
router.post('/review/new', verifyToken, reviewController.createReview);
router.get('/reviews', verifyToken, reviewController.getAllReviews);
router.get('/review/:id', verifyToken, reviewController.getReviewById);
router.put('/review/:id', verifyToken, reviewController.updateReview);
router.delete('/review/:id', verifyToken, reviewController.deleteReview);

//watchlist
router.post('/gamelist/new', verifyToken, gamelistController.createGamelist);
router.get('/gamelists', verifyToken, gamelistController.getAllGamelist);
router.get('/gamelist/:id', verifyToken, gamelistController.getGamelistById);
router.put('/gamelist/:id', verifyToken, gamelistController.updateGamelist);
router.delete('/gamelist/:id', verifyToken, gamelistController.deleteGamelist);


// router.get('/:id', verifyToken, movieController.getUserById);
// router.put('/:id', verifyToken, movieController.updateUser);
// router.delete('/:id', verifyToken, movieController.deleteUser);
// router.post('/logout', movieController.logoutUser);


module.exports = router;