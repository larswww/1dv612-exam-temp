'use strict';

let express = require('express');
let http = require('http');
let socketioJwt = require('socketio-jwt');
let dotenv = require('dotenv');
let handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
  });

let app = express();
let server;

dotenv.load();

let env = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    PORT: process.env.PORT,
  };


function startServer() {

  server = http.createServer(app).listen(env.PORT, function () {
      console.log('Express started in on http://localhost:' + env.PORT + '; press Ctrl-C to terminate.');
    });
    let io = require('socket.io')(server);

  io
      .on('connection', socketioJwt.authorize({
          secret: process.env.AUTH0_CLIENT_SECRET,
          timeout: 15000, // 15 seconds to send the authentication message
        }))
      .on('authenticated', function (socket) {
          console.log('hello! ' + JSON.stringify(socket.decoded_token));
        });

  //-------------         EVENTS          --------------//
  // let io = socketio(server);
  // app.set("socketio", io);
  // app.set("server", server);
  // count was the variable passed in to count active users
  // ioController(io, count);

}

if (require.main === module) {
  // app running directly
  startServer();
} else {
  // app imported
  module.exports = startServer;
}

app.set('port', env.PORT);

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

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

// node server
// auth0 login with passport
// github api
// feed github data into client
// start working with client
