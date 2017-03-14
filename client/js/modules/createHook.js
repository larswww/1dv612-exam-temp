'use strict';
var CORE = require('../core');

CORE.create_module('hooks', function (sb) {

    var createHook = function (hookUrl) {
        var socket = sb.socket();

        socket.emit('create-hook', {url: hookUrl})


    };


    return {
        init: function () {
            sb.listen({
                'create-hook': createHook
            })

        },

        destroy: function () {

        }
    }

});