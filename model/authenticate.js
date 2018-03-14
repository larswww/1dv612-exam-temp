'use strict';
const passport = require('passport');
const GithubStrategy = require('passport-github2');
const dotenv = require('dotenv');

function handleAuth (accessToken, refreshToken, user, done) {
    user.accessToken = accessToken;
    user.user = user
    done(null, user);
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

