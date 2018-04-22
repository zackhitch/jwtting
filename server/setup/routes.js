const jwt = require('jsonwebtoken');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const { ExtractJwt } = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;

const User = require('../users/User');
const secret = 'no size limit on tokens';

function makeToken(user) {
  // sub: subject (id) who the token is about
  // iat: issued at time
  const timestamp = new Date().getTime();
  const payload = {
    sub: user._id,
    iat: timestamp,
    username: user.username,
    race: user.race,
  };
  const options = { expiresIn: '4h' };

  return jwt.sign(payload, secret, options);
}

// { usernameField: email }
const localStrategy = new LocalStrategy(function(username, password, done) {
  console.log(username, password);
  User.findOne({ username }, function(err, user) {
    if (err) {
      done(err);
    }

    if (!user) {
      done(null, false);
    }

    user.verifyPassword(password, function(err, isValid) {
      if (err) {
        return done(err);
      }

      if (isValid) {
        const { _id, username, race } = user;

        return done(null, { _id, username, race }); // place on req.user
      }

      return done(null, false);
    });
  });
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

const jwtStrategy = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findById(payload.sub)
    .select('-password')
    .then(user => {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
    .catch(err => {
      // handle
      return done(err, false);
    });
});

// use strategies
passport.use(localStrategy);
passport.use(jwtStrategy);

// generate passport middleware
const authenticate = passport.authenticate('local', { session: false });
const protected = passport.authenticate('jwt', { session: false });

module.exports = function(server) {
  server.get('/api/hobbits', protected, (req, res) => {
    User.find({ race: 'hobbit' })
      .select('-password')
      .then(hobbits => {
        res.status(201).json(hobbits);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  // sanity check route
  server.get('/', function(req, res) {
    res.send({ api: 'up and running' });
  });

  server.post('/api/register', function(req, res) {
    const credentials = req.body;

    // add a pre('save') hook to the User schema
    // that will hash the password before
    // persisting the user to the database
    const user = new User(credentials);
    user.save().then(inserted => {
      const token = makeToken(inserted);
      res.status(201).json({ token });
    });
  });

  server.post('/api/login', authenticate, (req, res) => {
    // find user using the creds from body
    // verify password with what we have stored
    // if successful issue token to user
    res.status(200).json({ token: makeToken(req.user), user: req.user });
  });
};
