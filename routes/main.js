'use strict';
const router = require('express').Router();
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/auth');

let env = {
    VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY
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

router.get('/auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/auth'}),
    function (req, res) {
        res.redirect(req.session.returnTo || '/dashboard');
    });


router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.post('/webhook/callback', function (req, res, next) {
    console.log('webhook');
    console.log(req.body);
    res.status(200);
    res.send();

    /*
     if ( req.ip != '131.103.20.165' && req.ip != '131.103.20.166' ) {
     res.json({ message : 'Untrusted origin' });
     return;
     }
     */
});

module.exports = router;