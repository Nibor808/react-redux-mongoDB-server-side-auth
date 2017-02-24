const auth = require('./controllers/auth');
require('./services/passport');
const passport = require('passport');

// passport default is cookie based session so we tell it not to do that session: false
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {

  app.post('/signup', auth.signup);

  app.get('/', requireAuth, function(req, res, next) {
    res.send({ message: 'Super secret code is ABC123' });
  });

  app.post('/signin', requireSignin, auth.signin);

}