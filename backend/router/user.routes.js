const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/register', userController.userLogin);
router.post('/login', userController.userLogin);

module.exports = router;
