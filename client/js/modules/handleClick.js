'use strict';
var CORE = require('../core');

CORE.create_module('clickHandler', function (sb) {

    var interfaceClick = function (event) {
        event.preventDefault();
        event.stopPropagation();

        var hookUrl = event.currentTarget.getAttribute('data-hook');
        var org = event.currentTarget.getAttribute('data-org');

        sb.notify({
            type: 'create-hook',
            data: {
                url: hookUrl,
                org: org
            }
        })

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
                subButtons[i].addEventListener("click", interfaceClick);
            }

        }
    }
});