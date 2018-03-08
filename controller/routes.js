'use strict';
const router = require('express').Router();
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
const db = require('../model/db');
const webPush = require('../model/webPush');
const createNotification = require('../model/helpers/notification');
const githubAPI = require('../model/githubAPI');
const socket = require('./socket');
const paramValidationHelper = require('./helpers/validateUserIDparam');



let env = {
    VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY
};

router.get('/login', function (req, res) {
    res.render('start');
});

router.get('/auth/github',
    passport.authenticate('github', {scope: ['user', 'notifications', 'admin:repo_hook', 'admin:org_hook']})
);

router.get('/auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/login', successRedirect: '/'})
);


router.get('/', ensureLoggedIn('/login'), function (req, res) {
    githubAPI.createClient(req.user.accessToken);
    Promise.all([githubAPI.basicRequests(req.user.accessToken), db.handleLogin(req.user)]).then(userSettings => {
        let context = {title: 'Express', env: env, user: req.user, git: userSettings[0], prefs: userSettings[1]};
        res.render('notifications', context);
    });
});

router.get('/api/notifications', ensureLoggedIn('/api/unauthorized'), function (req, res) {
    let sample = require('../test/data/handleLoginSample')
    // db.handleLogin(req.user).then((data) => {
        res.send({message: 'some notifications!', data: JSON.parse(sample)})

    // })
})

router.get('/api/settings', ensureLoggedIn('/api/unauthorized'), function (req, res) {
    let sample = require('../test/data/githubAPIbasicRequestsSample')
    // githubAPI.createClient(req.user.accessToken);
    // githubAPI.basicRequests(req.user.accessToken).then((git) => {
        res.send({message: 'some settings', data: JSON.parse(sample)})
    // })
})

router.get('/api/stats', ensureLoggedIn('/api/unauthorized'), function (req, res) {
    let sample = require('../test/data/githubAPIbasicRequestsSample')
    res.send({message: 'some stats!', data: JSON.parse(sample)})

})

router.get('/api/unauthorized', function (req, res) {
    res.status(401)
    res.send({error: true, message: 'must be logged in'})
})


router.get('/logout', ensureLoggedIn, function (req, res) {
    req.logout();
    res.redirect('/login');
});

router.post('/webhook/payload/:id', function (req, res) {
    let userId = paramValidationHelper(req.params.id);
    res.status(200);
    res.send();

    if (userId) {
        console.log(userId);
        let newNotice = createNotification.format(req.params.id, req.headers['x-github-event'], req.body);

        db.getUser(userId).then(user => {

            console.log('routes 66', user);
            if (user) {
                if (user._doc.subscription) webPush.toSubscriber(user._doc.subscription, newNotice);
                db.saveNotification(user, newNotice);

            } else {
                console.error('didnt find relevant user', req.params.id);
            }
        });

        /*
         if ( req.ip != '131.103.20.165' && req.ip != '131.103.20.166' ) {
         res.json({ message : 'Untrusted origin' });
         return;
         }
         */
    } else {
        console.log('no user id in param')
    }
});

module.exports = router;