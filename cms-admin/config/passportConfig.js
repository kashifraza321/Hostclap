const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Passport local strategy
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findByUsername(username);
      if (!user) return done(null, false, { message: 'Invalid credentials' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: 'Invalid credentials' });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
