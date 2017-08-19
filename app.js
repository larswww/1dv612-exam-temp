'use strict';

const express = require('express');
const http = require('http');
const dotenv = require('dotenv');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const redisClient = redis.createClient();
const sessionStore = new RedisStore({ client: redisClient });
const logger = require('morgan');

const bodyParser = require('body-parser');
const hbsHelpers = require('./views/helpers');
const handlebars = require('express-handlebars').create(hbsHelpers);

const auth = require('./model/auth');

const db = require('./model/db');

const socketController = require('./controller/socket');

let server;

dotenv.load();

const app = express();

function startServer() {

    server = http.createServer(app).listen(process.env.PORT, function () {
        console.log('Express started in on http://localhost:' + process.env.PORT + '; press Ctrl-C to terminate.');
    });

    db.connect(process.env.MLAB_CONNECTION_STRING).then(() => {
        // let testFile = require('./test-file')();
    });

    const io = require('socket.io')(server);
    const passportSocketIo = require('passport.socketio');

    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: 'connect.sid',
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
    }));

    io.on('connection', socket => {
        socketController.activate(socket);
    });

}

app.set('port', process.env.PORT);

app.use(logger('dev'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    }
}));
app.use(auth.initialize());
app.use(auth.session());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(function (req, res, next) {
    next();
});

//-- Routes --//

app.use('/', require('./controller/routes.js'));

// Fånga och ge error till handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler för dev, skriver ut stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
        });
    });
    process.on('unhandledRejection', r => console.error(r));
}

// Production error handler utan stacktrace
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
    });
});

if (require.main === module) {
    // app running directly
    startServer();
} else {
    // app imported
    module.exports = startServer;
}
