'use strict'
const express = require('express')
const http = require('http')
const dotenv = require('dotenv')
const passport = require('passport')
const GithubStrategy = require('passport-github2')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const redis = require('redis')
const redisClient = redis.createClient()
const sessionStore = new RedisStore({client: redisClient})
const logger = require('morgan')
const mongoose = require('mongoose')
const dbFacade = require('./model/dbFacade')

const bodyParser = require('body-parser')
const handlebars = require('express-handlebars').create({defaultLayout: 'main'})

const seedDb = require('./test/seedDb')

let server

dotenv.load()

const app = express()

async function startServer () {

  server = http.createServer(app).listen(process.env.PORT, function () {
    console.log('Express started in on http://localhost:' + process.env.PORT + '; press Ctrl-C to terminate.')
  })

  await mongoose.connect(process.env.LOCAL_CONNECTION_STRING, {useMongoClient: true})
  await seedDb()
}

app.set('port', process.env.PORT)

app.use(logger('dev'))
app.use('/public', express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  }
}))
app.use(passport.initialize())
app.use(passport.session())
// const authenticate = require ('./model/authenticate')

app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

app.use(function (req, res, next) {
  next()
})

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

let strategy = new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackUrl: process.env.GITHUB_CALLBACK_URL

}, async function (accessToken, refreshToken, profile, done) {
  profile.accessToken = accessToken
  let user = await dbFacade.handleLogin(profile)
  if (!user) return done(true)
  user.profile = profile
  done(null, user)
})

passport.use(strategy)

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

//-- Routes --//

app.use('/', require('./controller/routes.js'))


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = err

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

process.on('unhandledRejection', r => console.error('unhandledRejection', r))

if (require.main === module) {
  // app running directly
  startServer()
} else {
  // app imported
  module.exports = startServer
}
