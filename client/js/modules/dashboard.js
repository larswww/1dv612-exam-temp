'use strict';

var CORE = require('../core');

CORE.create_module('dashboard', function (sb) {

    var subButtonInfo = function (event) {

        event.preventDefault();
        event.stopPropagation();

        return {
            hookUrl: event.currentTarget.getAttribute('data-hook'),
            org: event.currentTarget.getAttribute('data-org')
        };
    };

    var subscribeHook = function (event) {

        sb.notify({
            type: 'create-hook',
            data: subButtonInfo(event),
        });

        sb.removeEvent(event.currentTarget, 'click', subscribeHook);
        sb.addEvent(event.currentTarget, 'click', unsubscribeHook);
        subscribed(true, event.currentTarget);
    };

    var unsubscribeHook = function (event) {

        sb.notify({
            type: 'delete-hook',
            data: subButtonInfo(event)
        });

        sb.removeEvent(event.currentTarget, 'click', unsubscribeHook);
        sb.addEvent(event.currentTarget, 'click', subscribeHook);
        subscribed(false, event.currentTarget);
    };

    var subscribeButtons = function () {

        $('.unsubs').each(function () {
                sb.addEvent(this, 'click', unsubscribeHook);
        });

        $('.subs').each(function () {
            sb.addEvent(this, 'click', subscribeHook);
        });

    };

    var subscribed = function (bool, target) {

        if (bool) {
            target.className = 'btn btn-danger unsubs';
            target.innerText = 'Unsubscribe';

        } else {
            target.className = 'btn btn-primary subs';
            target.innerText = 'Subscribe';
        }
    };

    return {
        init: function () {
            subscribeButtons();
        },

        destroy: function () {

        },
    }
});