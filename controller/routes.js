'use strict';
const router = require('express').Router();
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const db = require('../model/db');
const webPush = require('../model/webPush');
const createNotification = require('../model/helpers/notification');
const githubAPI = require('../model/githubAPI');

let env = {
    VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY
};

router.get('/login', function (req, res) {
    res.render('start');
});

router.get('/', ensureLoggedIn, function (req, res) {
    res.render('dashboard', {title: 'Express', env: env, user: req.user});
});

router.get('/auth/github',
    passport.authenticate('github', {scope: ['user', 'notifications', 'admin:repo_hook', 'admin:org_hook']})
);

router.get('/auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/auth', successRedirect: '/auth/success'})
);

router.get('/auth/success',
    ensureLoggedIn,
    function (req, res) {
       // githubAPI.createClient(req.user.accessToken);
        db.handleLogin(req.user);
    res.redirect('/');
    });

router.get('/logout', ensureLoggedIn, function (req, res) {
    req.logout();
    res.redirect('/');
});

router.post('/webhook/payload', function (req, res, next) {
    console.log('webhook');
    console.log(req.body);
    res.status(200);
    res.send();

    let newNotice = createNotification.format(req.headers['x-github-event'], req.body);

    //let createNotification. = req.headers['x-github-event'];

    db.findSubscribers(newNotice).then(subscribers => {
        webPush.toSubscribers(subscribers, newNotice);
        db.saveNotification(subscribers, newNotice);
    });

    /*
     if ( req.ip != '131.103.20.165' && req.ip != '131.103.20.166' ) {
     res.json({ message : 'Untrusted origin' });
     return;
     }
     */
});

module.exports = router;