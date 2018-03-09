'use strict'

var CORE = require('../core');

CORE.create_module('loading', function (sb) {

    var start = function (event) {
        var loaderIcon = `<i class="fas fa-spinner fa-spin" id='${event.selector}Loading'style="font-size:24px"></i>`
        sb.append_elements(`${event.selector} > ${event.target}`, [loaderIcon])
    }

    var stop = function (event) {
        sb.remove_element(`${event.selector}Loading`)
    }

    return {
        init: function () {
            sb.listen({
                'start-loading': start

            })
            sb.listen({
                'stop-loading': stop
            })
        },

        destroy: function () {

        },
    }
})