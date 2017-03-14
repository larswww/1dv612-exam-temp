'use strict';
var CORE = require('../core');

CORE.create_module('auth', function (sb) {
    var button;
    // var lock;
    // var userProfile;
    var userToken = localStorage.getItem('userToken');

    var userProfile = {
        clientID: "FxN8RQSXo1kNnWXfvFgTYn8ZtEy4esPc",
        collaborators: 0,
        created_at: "2017-03-08T15:21:17.598Z",
        disk_usage: 35702,
        email: "lw222ii@student.lnu.se",
        email_verified: true,
        emails: Array[1],
        events_url: "https://api.github.com/users/larswww/events{/privacy}",
        followers: 0,
        followers_url: "https://api.github.com/users/larswww/followers",
        following: 4,
        following_url: "https://api.github.com/users/larswww/following{/other_user}",
        gists_url: "https://api.github.com/users/larswww/gists{/gist_id}",
        global_client_id: "D1E9ltoHX3jSkCYKBFIjCmvcw06zBJmI",
        gravatar_id: "",
        html_url: "https://github.com/larswww",
        identities: Array[1],
        name: "lw222ii@student.lnu.se",
        nickname: "larswww",
        organizations_url: "https://api.github.com/users/larswww/orgs",
        owned_private_repos: 1,
        picture: "https://avatars2.githubusercontent.com/u/14055501?v=3",
        plan: Object,
        private_gists: 0,
        public_gists: 0,
        public_repos: 20,
        received_events_url: "https://api.github.com/users/larswww/received_events",
        repos_url: "https://api.github.com/users/larswww/repos",
        site_admin: false,
        starred_url: "https://api.github.com/users/larswww/starred{/owner}{/repo}",
        subscriptions_url: "https://api.github.com/users/larswww/subscriptions",
        total_private_repos: 1,
        two_factor_authentication: false,
        type: "User",
        updated_at: "2017-03-13T11:59:17.838Z",
        url: "https://api.github.com/users/larswww",
        user_id: "github|14055501"
    };


    var activateLock = function () {
        // console.log('lock activated');
        //
        // lock.on('authenticated', function (authResult) {
        //     lock.getProfile(authResult.idToken, function (error, profile) {
        //         if (error) {
        //             console.error(err);
        //             // Handle error
        //             return;
        //         }
        //         localStorage.setItem('userToken', authResult.idToken);
        //         userProfile = profile;
        //         userToken = authResult.idToken;
        //         debugger;
                activateSocket();
        //     });
        // });
        //
        // if (userToken) {
        //     lock.getProfile(userToken, function (err, profile) {
        //         if (err) {
        //             return alert('There was an error getting the profile: ' + err.message);
        //         }
        //         userProfile = profile;
        //         activateSocket();
        //     });
        // }

    };

    var activateSocket = function () {
        // var socket = io();
        //TODO get io from sb if you're going to use it here.
        sb.notify({
            type: 'logged-in',
            data: userProfile
        });

        sb.notify({
            type: 'socket-authenticate',
            data: userToken
        });


        // socket.on('connect', function () {
        //     socket
        //         .emit('authenticate', {token: userToken}) //send the jwt
        //         .on('authenticated', function () {
        //             console.log('client authenticated');
        //             socket.emit('authenticate', {token: userToken}) //send the jwt
        //
        //             //do other things
        //         })
        //         .on('unauthorized', function(msg) {
        //             console.log("unauthorized: " + JSON.stringify(msg.data));
        //             throw new Error(msg.data.type);
        //         })
        // });

        // socket.on('connect', function () {
        //     console.log('connect');
        //     socket.emit('test-message', {message: 'snel hesting 1 2 3'});
        //     socket.on('authenticated', function () {
        //         console.log('authenticated');
        //         //Do
        //
        //     })
        //         .emit('authenticate', {token: userToken}); // send the jwt
        //     console.log( {token: userToken });
        // });
    };

    let handleClick = function (e) {
        e.preventDefault();
        activateLock(); //normally called by lock.show()
        //lock.show();
    };


    return {
        init: function () {
            // lock = sb.lock();
            activateLock();
            button = sb.find('button')[0];
            sb.addEvent(button, 'click', handleClick);
        },

        destroy: function () {

        }
    };

});
