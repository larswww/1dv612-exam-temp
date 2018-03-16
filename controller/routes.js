'use strict'
const router = require('express').Router()
const passport = require('passport')
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
const webPush = require('../model/webPush')
const createNotification = require('../model/helpers/notification')
const paramValidationHelper = require('./helpers/validateUserIDparam')
const dbFacade = require('../model/dbFacade')
const githubFacade = require('../model/githubFacade')

let env = {
  VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY
}

router.get('/login', async function (req, res) {
  res.status(200)
  res.render('login')
})

router.get('/', ensureLoggedIn('/login'), async function (req, res) {
  let user = await dbFacade.getUserById(req.user._id)
  res.cookie('lastLogin', user.lastLogin, {encode: String})
  res.status(200)
  res.render('dashboard', {user: req.user ? true : false})
  await dbFacade.updateLastLogin(user)
})

router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/login')
})

router.get('/auth/github',
  passport.authenticate('github', {scope: ['user', 'notifications', 'admin:repo_hook', 'admin:org_hook']})
)

router.get('/auth/github/callback',
  passport.authenticate('github', {failureRedirect: '/login', successRedirect: '/'})
)

router.get('/api/notifications', ensureLoggedIn('/login.html'), async function (req, res) {
  let notifications = await dbFacade.getNotificationsFor(req.user._id)
  res.status(200)
  res.send({message: 'some notifications!', data: notifications})

  // })
})

router.get('/api/settings', ensureLoggedIn('/api/unauthorized'), async function (req, res) {
  let github = new githubFacade(req.user.accessToken)
  let orgs = await github.apiRequest('orgs')
  let hooks = await dbFacade.getGooks(req.user._id)
  res.status(200)
  res.send({message: 'some settings', data: {orgs, hooks}})
})

router.post('/api/settings', ensureLoggedIn('/api/unauthorized'), async function (req, res) {
  let github = new githubFacade(req.user.accessToken)

  for (let org in req.body) {
    try {
      if (req.body[org]) {
        if (await dbFacade.hookExists(req.user._id, org)) {
          let hook = await github.createHook(org, req.user.id)
          await dbFacade.saveHook(req.user._id, org, hook)
        }

      } else {
        let hookRemoved = await dbFacade.removeHook(req.user._id, org)
        if (hookRemoved) await github.deleteHook(hookRemoved.id, org)
      }
    } catch (e) {
      console.error(e)
    }
  }
  res.status(200)
  res.send({message: 'settings updated'})
})

router.get('/api/stats', ensureLoggedIn('/api/unauthorized'), async function (req, res) {
  let github = new githubFacade(req.user.accessToken)
  let promises = [await github.apiRequest('orgs'), await github.apiRequest('repos'), await github.apiRequest('teams')]

  Promise.all(promises).then(values => {
    res.send({message: 'some stats!', data: {orgs: values[0], repos: values[1], teams: values[2]}})
  })
})

router.post('/api/push/subscribe', ensureLoggedIn('/api/unauthorized'), async function (req, res) {
  dbFacade.saveSubscription(req.body, req.user) // todo then for sub button, figure out the resolve.
  let newNotice = createNotification.format(req.user.id, 'sub')
  webPush.toSubscriber(req.body, newNotice)
  res.status(200)
  res.send({message: 'subscription created'})
})

router.post('/api/push/unsubscribe', ensureLoggedIn('/api/unauthorized'), async function (req, res) {
  dbFacade.deleteSubscription(req.user)
  res.status(200)
  res.send({message: 'subscription removed'})
})

router.get('/api/unauthorized', function (req, res) {
  res.status(401)
  res.send({error: true, message: 'must be logged in'})
})

router.post('/webhook/payload/:id', async function (req, res) {
  let userId = paramValidationHelper(req.params.id)

  /*
    if ( req.ip != '131.103.20.165' && req.ip != '131.103.20.166' ) {
    res.json({ message : 'Untrusted origin' });
    return;
    }
    */

  res.status(200)
  res.send()

  if (userId) {
    let newNotice = createNotification.format(req.params.id, req.headers['x-github-event'], req.body)
    let user = await dbFacade.getUserByGithubId(userId)

    if (user) {

      if (user._doc.subscription !== 'false') webPush.toSubscriber(JSON.parse(user._doc.subscription), newNotice)
      await dbFacade.saveNotification(user, newNotice)

    } else {
      console.error('didnt find relevant user', req.params.id)
    }

  } else {
    console.log('no user id in param')
  }


})

module.exports = router