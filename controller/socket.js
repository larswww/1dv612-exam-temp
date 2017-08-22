'use strict';
const githubAPI = require('../model/githubAPI');
const webPush = require('../model/webPush');
const db = require('../model/db');
const createNotification = require('../model/helpers/notification');
let connectedSocket;

function socketController(socket) {

    connectedSocket = socket;
    githubAPI.createClient(socket.request.user.accessToken);

    socket.on('create-hook', org => {
        console.log(org);
        if (socket.request.user && socket.request.user.logged_in) {
            githubAPI.createHook(org, socket.request.user.id).then(hook => {
                db.subscribe(hook, socket.request.user)
            });
        }
    });

    //todo send notification on unsub?
    socket.on('delete-hook', org => {
       if (socket.request.user && socket.request.user.logged_in) {
           db.unsubscribe(org, socket.request.user).then(hookID => {
               githubAPI.deleteHook(hookID, org);
           })
       }
    });

    socket.on('push-subscription', subscription => {
        db.saveSubscription(subscription, socket.request.user);
        let newNotice = createNotification.format(socket.request.user.id, "sub");
        webPush.toSubscriber(JSON.stringify(subscription), newNotice);
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
            // do smth
            break;
        case 'user-subscriptions':
            // needed?
            break;
    }
}

exports.activate = socketController;
exports.emit = emit;