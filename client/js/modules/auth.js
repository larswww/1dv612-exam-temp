'use strict';
var CORE = require('../core');

CORE.create_module('auth', function (sb) {
    var button;
    var userProfile;
    var userToken;

    // var id_token = localStorage.getItem('id_token');
    var lock = new Auth0Lock(
        'FxN8RQSXo1kNnWXfvFgTYn8ZtEy4esPc',
        'lw222ii.auth0.com',
        {
            auth: {
                redirect: false
            }
        }
    );

    var getProfile = function (idToken) {
        lock.getProfile(idToken, function (err, profile) {
            if (err) {
                console.log('Cannot get user', err);
                return;
            }
            console.log('connected and authenticated');
            userProfile = profile;
            localStorage.setItem('id_token', idToken);
            userToken = idToken;
            activateSocket(userProfile, idToken)
    })};

    // if (id_token) {
    //     getProfile(id_token);
    // }


    lock.on("authenticated", function (authResult) {
        debugger;
        getProfile(authResult.idToken);
        lock.getProfile(authResult.idToken, function (error, profile) {
            if (error) {
                // Handle error
                return;
            }

            localStorage.setItem('id_token', authResult.idToken);
            localStorage.setItem('profile', JSON.stringify(profile));
            activateSocket(profile, authResult);
        });
    });

    var activateSocket = function (userProfile, idToken) {
        sb.notify({
            type: 'logged-in',
            data: userProfile
        });

        sb.notify({
            type: 'socket-authenticate',
            data: userProfile
        });

    };

    let handleClick = function (e) {
        e.preventDefault();
        lock.show();
    };


    return {
        init: function () {
            // lock = sb.lock();
            button = sb.find('button')[0];
            sb.addEvent(button, 'click', handleClick);
        },

        destroy: function () {

        }
    };

});
