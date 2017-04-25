'use strict';
let githubAPI = require('../model/githubAPI');
const webPush = require('../model/webPush');
let connectedSocket;

function socketController(socket) {

    connectedSocket = socket;

    socket.on('create-hook', org => {
        githubAPI.createHook(org);
    });

    socket.on('base-req', data => {
        githubAPI.basicRequests();
    });

    socket.on('push-subscription', data => {
        //todo save the subscription in db.
        webPush.subscribe(data);
    });

}

function emit(event, data) {
    connectedSocket.emit(event, data);

    switch (event) {
        case 'github-organisations':
            /// do stuff with the
            break;
        case 'org-repos':
            // do stuff with repos?
            break;

    }
}

exports.activate = socketController;
exports.emit = emit;