'use strict';
var CORE = require('../core');

CORE.create_module('clickHandler', function (sb) {

    var subscribeHook = function (event) {
        event.preventDefault();
        event.stopPropagation();

        var hookUrl = event.currentTarget.getAttribute('data-hook');
        var org = event.currentTarget.getAttribute('data-org');

        debugger;

        sb.notify({
            type: 'create-hook',
            data: {
                url: hookUrl,
                org: org
            }
        });

        sb.removeEvent(event.currentTarget, 'click', subscribeHook);
    };


    return {
        init: function () {
            sb.listen({
                'org-buttons': this.orgButtons
            });

        },

        destroy: function () {

        },

        orgButtons: function () {
            var subButtons = $('button.subs');

            for (var i = 0; i < subButtons.length; i += 1) {

                sb.addEvent(subButtons[i], 'click', subscribeHook);
            }

        }
    }
});