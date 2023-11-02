const Exercise = require('../models/Exercise');
const User = require('../models/User');
const Language = require('../models/Language');

const getExercisesByLanguage = async (req, res) => {
    const { level=1, languageId } = req.query;
    try {
      let exercises;
      if (level && !isNaN(level)) {
        exercises = await Exercise.find({ languageId, difficultyLevel: { $gte: parseInt(level) } });
      } else {
        exercises = await Exercise.find({ languageId });
      }
      res.status(200).json(exercises);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

// Controller to add a new exercise
const addExercise = async (req, res) => {
  const { languageId, difficultyLevel, question, options, correctAnswer } = req.body;
  const newExercise = new Exercise({
    languageId,
    difficultyLevel,
    question,
    options,
    correctAnswer,
  });

  try {
    const exercise = await newExercise.save();
    // const newExercises = savedLanguage.exercises.push(exercise.id);
    await Language.findOneAndUpdate(
        { _id: languageId },
        {
          $push: {
            exercises: exercise.id
          }
        }
      );
    
    res.status(201).json(exercise);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to update an exercise
const updateExercise = async (req, res) => {
  const { id } = req.params;
  try {
    const exercise = await Exercise.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(exercise);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to delete an exercise
const deleteExercise = async (req, res) => {
  const { id } = req.params;
  try {
    const savedExercise = await Exercise.findById(id);
    await Language.findOneAndUpdate(
        { _id: savedExercise.languageId },
        {
          $pull: {
            exercises: id
          }
        }
      );
    await Exercise.findByIdAndDelete(id);
    res.status(200).json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
};

//submit answer
const submitAnswer = async (req, res) => {
    const { exerciseId, userAnswer, languageId } = req.body;
    const userId = req.user.id;
    try {
      const exercise = await Exercise.findById(exerciseId);
      if (!exercise) {
        return res.status(404).json({ error: 'Exercise not found' });
      }
  
      const isCorrect = exercise.correctAnswer === userAnswer;
      const score = isCorrect ? exercise.difficultyLevel : 0; // Update the scoring logic based on exercise difficulty
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
    
      // Find the language proficiency in user's data and update progress
      let languageIndex = user.languageProficiency.findIndex(
        (item) => item.languageId.toString() === languageId
      );
        
      if (languageIndex === -1) {
        return res.status(404).json({ error: 'Language proficiency not found for user' });
      }
      
      user.languageProficiency[languageIndex].progress += score;
      user.languageProficiency[languageIndex].exercisesCompleted.push({
        exerciseId,
        score,
        progress: user.languageProficiency[languageIndex].progress
      });
      await user.save();
  
      res.status(200).json({ message: 'Answer submitted successfully', isCorrect, score });
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
  getExercisesByLanguage,
  addExercise,
  updateExercise,
  deleteExercise,
  submitAnswer
};