'use strict';

var CORE = require('../core');

CORE.create_module('subscribeButtons', function (sb) {
    let theButton;

    var subButtonInfo = function (event) {

        event.preventDefault();
        event.stopPropagation();

        return {
            hookUrl: event.currentTarget.getAttribute('data-hook'),
            org: event.currentTarget.getAttribute('data-org')
        };
    };

    var subscribeHook = function (event) {
        buttonState(false, event.currentTarget);

        sb.notify({
            type: 'create-hook',
            data: subButtonInfo(event)
        });

        sb.removeEvent(event.currentTarget, 'click', subscribeHook);
        sb.addEvent(event.currentTarget, 'click', unsubscribeHook);
        subscribed(true, event.currentTarget);
    };

    var unsubscribeHook = function (event) {
        buttonState(false, event.currentTarget);

        sb.notify({
            type: 'delete-hook',
            data: subButtonInfo(event)
        });

        sb.removeEvent(event.currentTarget, 'click', unsubscribeHook);
        sb.addEvent(event.currentTarget, 'click', subscribeHook);
        subscribed(false, event.currentTarget);
    };

    var subscribeButtons = function () {

        $('.subs').each(function () {
            sb.addEvent(this, 'click', subscribeHook);
        });

        $('.unsubs').each(function () {
            sb.addEvent(this, 'click', unsubscribeHook);
        });

    };

    var buttonState = function (stateBool, button) {

        if (stateBool) {
            theButton.disabled = false;

        } else {
            theButton = button;
            theButton.disabled = true;

        }
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
            sb.listen({
                'button-state': buttonState //todo is it necessary to make it this.buttonState???

            })
        },



        destroy: function () {

        },
    }
});