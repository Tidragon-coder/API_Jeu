const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');

//Route public
router.post('/login', userController.loginUser);
router.post('/register', userController.createUser);

// Route privé (JWT obligatoire)
router.get('/', verifyToken, userController.getAllUsers);
router.get('/:id', verifyToken, userController.getUserById);
router.put('/:id', verifyToken, userController.updateUser);
router.delete('/:id', verifyToken, userController.deleteUser);
router.post('/logout', userController.logoutUser);


module.exports = router;