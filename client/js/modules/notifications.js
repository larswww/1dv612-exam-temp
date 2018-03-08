'use strict';
var CORE = require('../core')

CORE.create_module('notifications', function (sb) {
    var selector = '#notifications'

    var recievedSettings = function (data) {
        console.log('recieved notifications ', data)
    }

    return {
        init: function () {
            sb.notify({type: 'start-loading', data: {selector: selector, target: 'h3'}})
            sb.listen({
                'notifications': recievedSettings //todo is it necessary to make it this.buttonState???

            })
        },



        destroy: function () {

        },
    }
})