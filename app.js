'use strict';

let express = require('express');
let http = require('http');
let socketioJwt = require('socketio-jwt');
let dotenv = require('dotenv');
let handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
});

let testGithub = require('./modules/githubApi');

let app = express();
let server;

dotenv.load();

function startServer() {

    server = http.createServer(app).listen(process.env.PORT, function () {
        console.log('Express started in on http://localhost:' + process.env.PORT + '; press Ctrl-C to terminate.');
    });

    let io = require('socket.io')(server);
    testGithub(io);
    //
    // io.on('connection', function (noAuthSocket) {
    //
    //     noAuthSocket.on('start', function () {
    //         console.log('start');
    //         testGithub(noAuthSocket);
    //
    //     });
    //
    //
    //     //TODO couldn't get the JWT auth working so temp dirty solution to move on.
    //     noAuthSocket.on('authenticate', function (token) {
    //         console.log('noAuth', token);
    //     });
    //
    //     io.use(socketioJwt.authorize({
    //         secret: process.env.AUTH0_CLIENT_SECRET,
    //         timeout: 15000 // 15 seconds to send the authentication message
    //     }));
    // }).on('authenticated', function(socket) {
    //         socket.on('authenticate', function (token) {
    //            console.log('auth', token);
    //         });
    //
    //     //this socket is authenticated, we are good to handle more events from it.
    //     console.log('hello! ' + socket.decoded_token.name);
    // });
}

if (require.main === module) {
    // app running directly
    startServer();
} else {
    // app imported
    module.exports = startServer;
}

app.set('port', process.env.PORT);

app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

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
