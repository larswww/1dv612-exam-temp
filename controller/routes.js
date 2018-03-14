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
const dbFacade = require('../model/dbFacade');
const githubFacade = require('../model/githubFacade')

let env = {
    VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY
};

router.get('/login', function (req, res) {
    res.render('login')
});

router.get('/', ensureLoggedIn('/login'), function (req, res) {
    res.render('dashboard', {user: req.user ? true : false})
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

router.get('/auth/github',
    passport.authenticate('github', {scope: ['user', 'notifications', 'admin:repo_hook', 'admin:org_hook']})
);

router.get('/auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/login', successRedirect: '/'})
);


router.get('/api/notifications', ensureLoggedIn('/login.html'), async function (req, res) {
    let notifications = await dbFacade.getNotificationsFor(req.user._id)


    // let sample = require('../test/data/handleLoginSample')
    // let payloads = require ('../test/data/payloadTypesAndSamples')
    // let plh = require('../model/helpers/payloadHandler')
    //
    // let results = []
    // for (let key in payloads) {
    //     results.push(plh(key, payloads[key].example))
    // }

    // db.handleLogin(req.user).then((data) => {
    res.send({message: 'some notifications!', data: notifications})

    // })
})

router.get('/api/settings', ensureLoggedIn('/api/unauthorized'), async function (req, res) {
    let github = new githubFacade(req.user.accessToken)
    // let sample = require('../test/data/githubAPIbasicRequestsSample')
    let orgs = await github.apiRequest('orgs')
    let hooks = await dbFacade.getGooks(req.user._id)
    // githubAPI.createClient(req.user.accessToken);
    // githubAPI.basicRequests(req.user.accessToken).then((git) => {
    res.send({message: 'some settings', data: {orgs, hooks}})
    // })
})

router.post('/api/settings', ensureLoggedIn('/api/unauthorized'), async function (req, res) {
    let github = new githubFacade(req.user.accessToken)

    for (let org in req.body) {
        try {
            if (req.body[org] === 'true') {

                if (await dbFacade.hookExists(req.user._id, org)) {
                    let hook = await github.createHook(org, req.user.id)
                    await dbFacade.saveHook(req.user._id, org, hook)
                }

            } else {

                let hookRemoved = await dbFacade.removeHook(req.user._id, org)
                if (hookRemoved) await githubAPI.deleteHook(hookRemoved.id, org)

            }

        } catch (e) {
            console.error(e)
        }
    }


    res.send({message: 'settings updated'})

})

router.get('/api/stats', ensureLoggedIn('/api/unauthorized'), async function (req, res) {
    // let sample = require('../test/data/githubAPIbasicRequestsSample')
    let data = await githubAPI.basicRequests(req.user.accessToken)

    res.send({message: 'some stats!', data: data})

})

router.post('/api/push/subscribe', ensureLoggedIn('/api/unauthorized'), async function (req, res) {
    db.saveSubscription(req.body, req.user); // todo then for sub button, figure out the resolve.
    let newNotice = createNotification.format(req.user.id, "sub");
    webPush.toSubscriber(req.body, newNotice);
    res.status(200)
    res.send({message: 'subscription created'})
})

router.post('/api/push/unsubscribe', ensureLoggedIn('/api/unauthorized'), async function (req, res) {
    db.deleteSubscription(req.user);
    res.status(200)
    res.send({message: 'subscription removed'})
})


router.get('/api/unauthorized', function (req, res) {
    res.status(401)
    res.send({error: true, message: 'must be logged in'})
})

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