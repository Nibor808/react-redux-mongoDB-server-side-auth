const User = require('../models/user');
const JWT = require('jwt-simple');
const config = require('../config');

//create token w/ timestamp sub: user.id, timestamp
// sub is convetion on JWT = subject, iat = issued at time and secret from config
function tokenForUser(user) {
  const timeStamp = new Date().getTime();
  return JWT.encode({ sub: user.id, iat: timeStamp }, config.secret); // sub is convetion on JWT = subject, iat = issued at time
}

//signin function
// user has had email and pass verified
// just need to give them a token
exports.signin = function(req, res, next) {
  res.send({ token: tokenForUser(req.user) });
}

// signup function
exports.signup = function(req, res, next) {
  // check for email and pass
  if (!req.body.email || !req.body.password) {
    return res.status(422).send({ error: 'You must provide an email and a passowrd' });
  }

  // see if user already exists Model.findOne
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (err) { return next(err); }

    // if user exists return an error
    // 422 = unprocessable entity, bad data, user exists
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    // if user doesn't exist, create and save user record
    const user = new User({
      email: req.body.email,
      password: req.body.password
    });

    user.save(function(err) {
      if (err) { return next(err); }
      // send json w/ token
      res.json({ token: tokenForUser(user) });
    });
  });

}