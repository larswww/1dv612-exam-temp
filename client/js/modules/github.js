'use strict';

var CORE = require('../core');

CORE.create_module('octonode', function (sb) {

    return {
        init: function () {
            lock = sb.lock();
            button = sb.find('a')[0];
            sb.addEvent(button, 'click', handleClick);
            activateLock();
        },

        destroy: function () {

        }
    };

});