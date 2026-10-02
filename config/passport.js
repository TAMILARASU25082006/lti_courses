const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback';

if (clientID && clientSecret && clientID !== 'your_google_client_id_here') {
  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value.toLowerCase();
          let user = await User.findOne({ email });

          if (user) {
            if (!user.googleId) {
              user.googleId = profile.id;
              if (profile.photos && profile.photos.length > 0 && user.profileImage === '/images/default-avatar.png') {
                user.profileImage = profile.photos[0].value;
              }
              await user.save();
            }
            return done(null, user);
          }

          // Create new student user from Google Profile
          user = await User.create({
            fullName: profile.displayName || profile.name.givenName + ' ' + profile.name.familyName,
            email,
            googleId: profile.id,
            profileImage: (profile.photos && profile.photos.length > 0) ? profile.photos[0].value : '/images/default-avatar.png',
            role: 'student'
          });

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
  console.log('✔ Google OAuth 2.0 Passport Strategy Configured.');
} else {
  console.log('ℹ Google OAuth 2.0 keys pending in .env (GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET)');
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
