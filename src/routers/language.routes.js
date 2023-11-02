const express = require('express');
const router = express.Router();
const languageController = require('../controllers/language.controller');
const {verifyToken, AuthorizedByAdmin} = require('../middlewares/index')

// Route for adding a new language
router.post('/add', AuthorizedByAdmin, languageController.addLanguage);

// Route for updating an language
router.put('/update/:id', AuthorizedByAdmin, languageController.updateLanguage);

// Route for deleting an language
router.delete('/delete/:id', AuthorizedByAdmin, languageController.deleteLanguage);

//Route for one language
router.get('/list-one/:id', verifyToken, languageController.getOneLanguage);

// Route for getting all language
router.get('/list-all', verifyToken, languageController.getAllLanguages);

//Route for user language
router.get('/get-user-languages', verifyToken, languageController.getUserLanguages);

// Route for the leaderboard list by language
router.get('/leaderboard-list', verifyToken, languageController.getLanguageLeaderboard);

module.exports = router;