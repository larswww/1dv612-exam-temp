'use strict';
var CORE = require('../core');

CORE.create_module('auth', function (sb) {
    var button;
    var lock;
    var socket;
    var userProfile;
    var userToken = localStorage.getItem('userToken');

    let activateLock = function () {

        lock.on('authenticated', function (authResult) {
            lock.getProfile(authResult.idToken, function (error, profile) {
                if (error) {
                    // Handle error
                    return;
                }
                localStorage.setItem('userToken', authResult.idToken);
                userProfile = profile;
                userToken = authResult.idToken;
                console.log(userProfile);
            });
        });

        if (userToken) {
            lock.getProfile(userToken, function (err, profile) {
                if (err) {
                    return alert('There was an error getting the profile: ' + err.message);
                }
                userProfile = profile;
            });
        }

    };

    let activateSocket = function () {

        socket.on('connection', function () {
            socket.on('authenticated', function () {
                //Do

            })
                .emit('authenticate', {token: userToken}); // send the jwt
        });
    };

    let handleClick = function (e) {
        e.preventDefault();
        lock.show();
    };


    return {
        init: function () {
            socket = sb.socket();
            lock = sb.lock();
            button = sb.find('a')[0];
            sb.addEvent(button, 'click', handleClick);
            activateLock();
            activateSocket()
        },

        destroy: function () {

        }
    };

});
