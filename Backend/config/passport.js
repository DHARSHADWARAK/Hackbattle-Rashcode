// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // import our Mongoose model

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // Must match one of your "Authorized redirect URIs" in Google Cloud Console
  callbackURL: 'http://localhost:5000/auth/google/callback'
}, 
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('🔹 Google profile:', profile);

      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        // Create a new user
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value
        });
        console.log('🔹 New user created:', user);
      } else {
        console.log('🔹 Existing user found:', user);
      }
      return done(null, user);
    } catch (err) {
      console.error('Error in GoogleStrategy:', err);
      return done(err, null);
    }
  }
));

// Passport session setup
passport.serializeUser((user, done) => {
  console.log('🔹 serializeUser:', user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log('deserializeUser:', user);
    done(null, user);
  } catch (err) {
    console.error('Error in deserializeUser:', err);
    done(err, null);
  }
});
