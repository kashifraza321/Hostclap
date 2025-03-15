const express = require('express');
const passport = require('passport');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');  // Assuming you’ll use a user model
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findByUsername(username); // Find user in DB
      if (!user) return done(null, false, { message: 'Invalid credentials' });
      
      const match = await bcrypt.compare(password, user.password); // Compare hashed passwords
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
  const user = await User.findById(id);  // Find user by ID
  done(null, user);
});

// Route to start login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Example protected route
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.render('dashboard', { user: req.user });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

const flash = require('connect-flash');
app.use(flash());
require('dotenv').config();  // Load environment variables from .env file

const sessionSecret = process.env.SESSION_SECRET || 'yourDefaultSecret';

