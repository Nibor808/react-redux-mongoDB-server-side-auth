const express =require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

// DB setup (connect to localhost using the auth dir and make a DB named auth)
mongoose.connect('mongodb://localhost:auth/auth');

const app = express();
app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
router(app);

app.listen(process.env.PORT || 3000, function() {
  console.log('App Listening');
});