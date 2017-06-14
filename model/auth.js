'use strict';

let passport = require('passport');
let GithubStrategy = require('passport-github2');
let dotenv = require('dotenv');

function handleAuth (accessToken, refreshToken, profile, done) {
    profile.accessToken = accessToken;
    console.log(accessToken);
    return done(null, profile);
};

dotenv.load();

let strategy = new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackUrl: process.env.GITHUB_CALLBACK_URL
}, handleAuth);


passport.use(strategy);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = passport;