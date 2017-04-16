'use strict';

let github = require('octonode');

let client = github.client('w9OPMUseLDnVtzUq');

client.get('/user', {}, function (err, status, body, headers) {
    console.log(body); //json object
    // socket.emit('octonode', body)
});

