const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// create local strategy for signing in
const LocalLogin = new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  // verify email and pass, call done with user
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    // no user match call done with false
    if (!user) { return done(null, false); }

    // compare passwords - is password equal to user.password
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if(!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});

// setup options object for JWT, jwtFromRequest; secretOrKey
// look at request header 'authorization' to find token using ExtractJWT.fromHeader()
const JWTOptions = {
  jwtFromRequest: ExtractJWT.fromHeader('authorization'),
  secretOrKey: config.secret
};

// create JWT Strategy for siging up, payload = decoded JWT token (sub, timestamp) from auth.js
const JWTLogin = new JWTStrategy(JWTOptions, function(payload, done) {
  // see if user.id in payload.sub exists in DB
  // if so call done with that user
  // else call done with no user object
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false); } // user object is false = no user

    if (user) {
      done(null, user); // null error and user object
    }else {
      done(null, false); // null error and no user found
    }
  });
});

// tell passport to use the strategy
passport.use(JWTLogin);
passport.use(LocalLogin);