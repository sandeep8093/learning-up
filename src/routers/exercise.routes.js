const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exercise.controller');
const {verifyToken, AuthorizedByAdmin} = require('../middlewares/index')

// Route for fetching exercises by language
router.get('/get', verifyToken, exerciseController.getExercisesByLanguage);

// Route for submitting user's answer
router.post('/submit', verifyToken, exerciseController.submitAnswer);

// Route for adding a new exercise
router.post('/add', AuthorizedByAdmin, exerciseController.addExercise);

// Route for updating an exercise
router.put('/update/:id', AuthorizedByAdmin, exerciseController.updateExercise);

// Route for deleting an exercise
router.delete('/delete/:id', AuthorizedByAdmin, exerciseController.deleteExercise);

module.exports = router;