'use strict';
var CORE = require('../core');

CORE.create_module('REST', function (sb) {

    var requestAll = function() {
        ajaxRequest({endpoint: 'settings', notify: 'settings'})
        ajaxRequest({endpoint: 'notifications', notify: 'notifications'})
        ajaxRequest({endpoint: 'stats', notify: 'stats'})
    }

    var ajaxRequest = function (event) {
        $.get('http://localhost:3000/api/' + event.endpoint, function (data) {
            sb.notify(event.notify, data)
        })
    }

    return {
        init: function () {
            requestAll();
            sb.listen({
                'ajax-request': this.ajaxRequest,
            });


        },

        destroy: function () {

        },

        ajaxRequest: ajaxRequest,
    }
});