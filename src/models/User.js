const mongoose = require('mongoose');
const schema = mongoose.Schema;

//creating schema
const UserSchema = new schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    isAdmin:{
      type: Boolean,
      required: true,
      default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    languageProficiency: [
        {
          languageId: {
            type: String,
          },
          progress: {
            type: Number,
            default: 0,
          },
          exercisesCompleted: [
            {
              exerciseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Exercise',
              },
              score: {
                type: Number,
                required: true,
              },
            },
          ],
        },
    ],
});

module.exports = User = mongoose.model('User',UserSchema);