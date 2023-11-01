const mongoose = require('mongoose');
const schema = mongoose.Schema;

//creating schema
const languageSchema = new schema({
    name: {
        type:String,
        required:true
    },
    exercises: [{
        type: schema.Types.ObjectId,
        ref: 'Exercise'
    }],
  });
  

module.exports = Language = mongoose.model('Language', languageSchema);