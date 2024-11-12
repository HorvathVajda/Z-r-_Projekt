// passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  db.query('SELECT * FROM users WHERE google_id = ?', [profile.id], (err, users) => {
    if (users.length === 0) {
      db.query('INSERT INTO users (google_id, name, email) VALUES (?, ?, ?)', [profile.id, profile.displayName, profile.emails[0].value], () => {
        return done(null, profile);
      });
    } else {
      return done(null, profile);
    }
  });
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
