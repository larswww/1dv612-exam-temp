'use strict';

var CORE = require('../core');

CORE.create_module('logout', function (sb) {
    var loginButton;

    function loggedIn(data) {
        var template = $('#template-login')[0].content.children;
        var shortname = template["0"].children["0"].childNodes[3];
        var fullname = template["0"].childNodes[3].childNodes[1].children["0"].children["0"].children[1].children["0"];
        var email = template["0"].childNodes[3].childNodes[1].children["0"].children["0"].children[1].children[1];
        var profileButton = template["0"].childNodes[3].childNodes[1].children["0"].children["0"].children[1].children[2].children["0"];
        var logoutButton = template["0"].children[1].children[2].children["0"].children["0"].children["0"].children["0"].children["0"];

        //TODO where to get the full name?
        shortname.textContent = data.nickname;
        email.textContent = data.email;
        profileButton.href = data.html_url;

        $('#auth').html(template);
        sb.addEvent(logoutButton, 'click', logOut);

//grab template
        // populate with data
        // append to

    }


    function logOut(e) {
        e.preventDefault();
        //TODO logout?
        $('#auth').html(loginButton);

    }

    return {
        init: function () {
            loginButton = $('#auth')[0];
            sb.listen({
                'logged-in': this.loggedIn,
                'log-out': this.logOut
            });
        },

        destroy: function () {

            // change it back to the login button.

        },

        loggedIn: function (data) {
            loggedIn(data);

        },

        logOut: function (event) {
            logOut(event);
        }
    }

});