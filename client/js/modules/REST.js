'use strict';
var CORE = require('../core');

CORE.create_module('REST', function (sb) {
    var loadAtStartup = ['settings', 'notifications', 'stats']

    var requestAll = function() {
        for (var item of loadAtStartup) {
            sb.notify({type: 'start-loading', data: {selector: `#${item}`, target: 'h3'}})
            ajaxRequest(item)
        }
    }

    var ajaxRequest = function (event) {
        $.get('http://localhost:3000/api/' + event, function (data) {
            sb.notify({type: event, data: data.data}) //ffs
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