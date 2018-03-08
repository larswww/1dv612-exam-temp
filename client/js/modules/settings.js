'use strict';

var CORE = require('../core');

CORE.create_module('settings', function (sb) {
    var selector = '#settings'

    var recievedSettings = function (data) {
        console.log('recieved settings ', data)
    }

    return {
        init: function () {
            sb.notify({type: 'start-loading', data: {selector: selector, target: 'h3'}})
            sb.listen({
                'settings': recievedSettings //todo is it necessary to make it this.buttonState???

            })
        },



        destroy: function () {

        },
    }
})