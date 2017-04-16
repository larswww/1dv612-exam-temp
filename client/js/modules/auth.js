'use strict';
var CORE = require('../core');

CORE.create_module('auth', function (sb) {
    var button;

    var lock = new Auth0Lock(
        'FxN8RQSXo1kNnWXfvFgTYn8ZtEy4esPc',
        'lw222ii.auth0.com',
        {
            auth: {
                redirect: false
            }
        }
    );

    lock.on("authenticated", function (authResult) {
        lock.getProfile(authResult.idToken, function (error, profile) {
            if (error) {
                // Handle error
                return;
            }

            localStorage.setItem('token', authResult.idToken);
            localStorage.setItem('profile', JSON.stringify(profile));
            activateSocket(profile, authResult);
        });
    });


    var activateSocket = function (userProfile, authResult) {
        debugger;
        sb.notify({
            type: 'logged-in',
            data: userProfile
        });

        userProfile.authResult = authResult;

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
