const User = require('../models/User');
const Language = require('../models/Language');

// Controller to fetch all available languages
const getAllLanguages = async (req, res) => {
  try {
    const languages = await Language.find();
    res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserLanguages = async (req, res) => {
  try {
    const userId = req.user.id; 
    const savedUser = await User.findById(userId);

    const languageIds = savedUser.languageProficiency.map(item => item.languageId);
    const languages = await Language.find({ _id: { $in: languageIds } });

    res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Controller to fetch one  languages
const getOneLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    const languages = await Language.findById(id);
    res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to add a new language
const addLanguage = async (req, res) => {
try {
    const newLanguage = new Language(req.body);
    const language = await newLanguage.save();
    res.status(201).json(language);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to update a language
const updateLanguage = async (req, res) => {
  const { id } = req.params;
  try {
    const language = await Language.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(language);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to delete a language
const deleteLanguage = async (req, res) => {
  const { id } = req.params;
  try {
    await Language.findByIdAndDelete(id);
    res.status(200).json({ message: 'Language deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getLanguageLeaderboard = async (req, res) => {
  const { languageId } = req.query;
  try {
    const leaderboard = await User.aggregate([
      { $unwind: '$languageProficiency' },
      {
        $match: { 'languageProficiency.languageId': languageId },
      },
      {
        $sort: { 'languageProficiency.progress': -1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 1,
          username: 1,
          progress: '$languageProficiency.progress',
        },
      },
    ]);
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllLanguages,
  addLanguage,
  updateLanguage,
  deleteLanguage,
  getLanguageLeaderboard,
  getOneLanguage,
  getUserLanguages
};
