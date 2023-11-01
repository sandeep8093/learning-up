const mongoose = require('mongoose');
const schema = mongoose.Schema;

//creating schema
const exerciseSchema = new schema({
    languageId: { 
        type: schema.Types.ObjectId,
        ref: 'Language'
    }, 
    difficultyLevel: {
        type:Number,
        required:true
    },
    question: {
        type: String,
        required:true
    },
    options: [String],
    correctAnswer: {
        type: String,
        required: true
    },
  });
  
module.exports = Exercise = mongoose.model('Exercise', exerciseSchema);

 