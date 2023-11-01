require('dotenv').config();
const express = require('express')
const router = express.Router();
const controllers = require('../controllers/user.controller');
const {verifyToken} = require('../middlewares/index')

// User register endpoint
router.post('/register', controllers.register);

// User login endpoint
router.post('/login', controllers.login);

// User profile details
router.get('/profile', verifyToken, controllers.getUserProfile);

// User's preferred language will be added
router.post('/add-progress', verifyToken, controllers.addUserProgress);

// User can reset any prefered language progress
router.post('/reset-progress', verifyToken, controllers.resetUserProgress);

module.exports = router;