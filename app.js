'use strict';

let express = require('express');
let http = require('http');
let dotenv = require('dotenv');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let passport = require('passport');
let GithubStrategy = require('passport-github2');
let bodyParser = require('body-parser');
let handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
});
let user = require('./modules/user');

let githubAPI = require('./modules/githubAPI');

let server;

dotenv.load();

let strategy = new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackUrl: process.env.GITHUB_CALLBACK_URL
}, user);


passport.use(strategy);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

let app = express();

function startServer() {

    server = http.createServer(app).listen(process.env.PORT, function () {
        console.log('Express started in on http://localhost:' + process.env.PORT + '; press Ctrl-C to terminate.');
    });

    let io = require('socket.io')(server);

    io.on('connection', socket => {
        githubAPI.activateSockets(socket);
    });

}


app.set('port', process.env.PORT);

app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'shhhhhhhhh',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(function (req, res, next) {
    next();
});

//-- Routes --//

app.use('/', require('./routes/main.js'));

app.get('/unauthorized', function (req, res) {

    res.status(403).render('unauthorized');
});

app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

// 505
app.use(function (err, req, res) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.render('500');
});

if (require.main === module) {
    // app running directly
    startServer();
} else {
    // app imported
    module.exports = startServer;
}
