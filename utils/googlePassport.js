/* eslint-disable no-shadow */
require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { findBy } = require('../resources/auth/model');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
async function verifyCallback(accessToken, refreshToken, profile, done) {
  /* This callback verifies user on our app's backend
  and create's a new user if this user isn't registered */
  const googleEmail = profile.emails[0].value;
  try {
    const user = await findBy({ email: googleEmail });
    if (user) {
      // done callback sets req.user on the request object
      // to second passed argument
      done(null, user);
    } else {
      // if user is not in db, set req.user to object
      // and set passwordNotSet flag to true
      const user = {
        passwordNotSet: true,
        full_name: profile.displayName,
        email: googleEmail,
      };
      done(null, user);
    }
  } catch (error) {
    done(error);
  }
}
passport.use(
  /* Strategy config, strategy is a function which 
  takes care of verifying the user's credentials */
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.GOOGLE_BACKEND_BASEURL}/auth/google/callback`,
    },
    verifyCallback
  )
);

module.exports = { Passport: passport };
