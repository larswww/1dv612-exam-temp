'use strict';
const router = require('express').Router();
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/auth');

let env = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/auth/github'
};

router.get('/', ensureLoggedIn, function (req, res) {
        res.render('dashboard', {title: 'Express', env: env, user: req.user});
    });

router.get('/auth', function (req, res) {
    res.render('start');
});

router.get('/auth/github',
    passport.authenticate('github', {scope: ['user', 'notifications', 'admin:repo_hook', 'admin:org_hook']})
);

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/auth'}),
    function (req, res) {
        res.redirect(req.session.returnTo || '/dashboard');
    });

module.exports = router;