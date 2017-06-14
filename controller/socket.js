'use strict';
const githubAPI = require('../model/githubAPI');
const webPush = require('../model/webPush');
const db = require('../model/db');
let connectedSocket;

function socketController(socket) {

    connectedSocket = socket;
    githubAPI.createClient(socket.request.user.accessToken);

    socket.on('create-hook', org => {
        if (socket.request.user && socket.request.user.logged_in) {
            githubAPI.createHook(org);
            db.subscribe(org, socket.request.user)
        }

    });

    socket.on('base-req', () => {
        githubAPI.basicRequests();
        db.userNotifications();
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
            db.saveOrganizations(data, connectedSocket.request.user);
            /// do stuff with the
            break;
        case 'org-repos':
            // do stuff with repos?
            break;
        case 'hook-created':


    }
}

exports.activate = socketController;
exports.emit = emit;