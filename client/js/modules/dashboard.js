'use strict';

var CORE = require('../core');

CORE.create_module('dashboard', function (sb) {

    var isSubscribed = function (button, alreadySubscribed) {
        // change the text etc for current target.
        // button color

        if (alreadySubscribed) {
            // change text content
            // change color
        }
    };

    var subButtonInfo = function (event) {

        event.preventDefault();
        event.stopPropagation();

        isSubscribed(event.currentTarget, true);

        return {
            hookUrl: event.currentTarget.getAttribute('data-hook'),
            org: event.currentTarget.getAttribute('data-org')
        };
    };

    var subscribeHook = function (event) {
        debugger;

        // todo get more form info i.e. checkboxes with spec sub settings.

        sb.notify({
            type: 'create-hook',
            data: subButtonInfo(event),
        });

        sb.removeEvent(event.currentTarget, 'click', subscribeHook);
        sb.addEvent(event.currentTarget, 'click', unsubscribeHook);
    };

    var unsubscribeHook = function (event) {

        sb.notify({
            type: 'delete-hook',
            data: subButtonInfo(event)
        });

        sb.removeEvent(event.currentTarget, 'click', unsubscribeHook);
        sb.addEvent(event.currentTarget, 'click', subscribeHook);
    };

    var subscribeButtons = function (subscribedOrgs) {
        debugger;

        $('.subs').each(function () {

            var currentOrg = this.getAttribute('data-org');

            if (subscribedOrgs[currentOrg]) {
                isSubscribed(this, true);
                sb.addEvent(this, 'click', unsubscribeHook);

            } else {
                sb.addEvent(this, 'click', subscribeHook);

            }

        });
    };

    return {
        init: function () {
            sb.listen({
                'prefs-subscriptions': this.subscribeButtons
            });
        },

        destroy: function () {

        },

        createEventChart: function (data) {
            createEventChart(data);
        },

        subscribeButtons: function (subs) {
            subscribeButtons(subs)
        }
    }
});