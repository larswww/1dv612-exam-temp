'use strict';
const githubAPI = require('../model/githubAPI');
const webPush = require('../model/webPush');
const db = require('../model/db');
let connectedSocket;

function socketController(socket) {

    connectedSocket = socket;

    socket.on('create-hook', org => {

        // if (socket.request.user && socket.request.user.logged_in) {
        //     console.log(socket.request.user);
        // }

        githubAPI.createHook(org);
    });

    socket.on('base-req', data => {

        githubAPI.basicRequests();
    });

    socket.on('push-subscription', data => {

        db.saveSubscription(data, socket.request.user);
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