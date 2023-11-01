const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
const db = process.env.DB_URL;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
app.get('/', function (req, res) {
  res.send('hello world')
  })
app.use('/user', require('./src/routers/user.routes'));
app.use('/language', require('./src/routers/language.routes'));
app.use('/exercise', require('./src/routers/exercise.routes'));
