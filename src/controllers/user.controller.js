const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
        username,
        email,
        password: hashedPassword,
        });

        const user = await newUser.save();
        res.status(201).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }
  };
  
const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
  
      const payload = {
          id: user.id,
          email: user.email,
          isAdmin : user.isAdmin
      };
  
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

// User profile controller
const getUserProfile = async (req, res) => {
    const userId = req.user.id; 
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

const addUserProgress = async (req, res) => {
    const userId  = req.user.id;
    const {languageId} = req.query;
    let progress= 0;
    let exercisesCompleted=[];
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            {
              $push: {
                languageProficiency: { languageId, progress, exercisesCompleted },
              },
            },
            { new: true }
          );
       
      res.status(200).json({ message: 'User progress added successfully', user });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

const resetUserProgress = async (req, res) => {
    let { languageId } = req.query;
    const userId = req.user.id;
    
    try {
        const savedUser = await User.findById(userId);
        if (!savedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        savedUser.languageProficiency.forEach(language => {
            if (language.languageId == languageId) {
                language.progress = 0;
                language.exercisesCompleted = [];
                savedUser.markModified('languageProficiency');
            }
        });
        await savedUser.save();
        res.status(200).json({ message: 'User progress for the language reset successfully' ,savedUser});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    register,
    login,
    getUserProfile,
    addUserProgress,
    resetUserProgress
}