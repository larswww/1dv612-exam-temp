'use strict';

var CORE = require('../core');

CORE.create_module('dashboard', function (sb) {
    var panelTemplate;

    var createEventChart = function (eventData) {
        var eventCount = {
            IssuesEvent: 0,
            CreateEvent: 0,
            PushEvent: 0,
            ReleaseEvent: 0
        };

        var data = {};
        var pushEvents;
        var releaseEvents;
        var createEvents;

        eventData.events.forEach(function (obj) {
            var year = obj.created_at.substr(0, 4);
            eventCount[year] = eventCount
        });

        eventData.events.forEach(function (obj) {
            var year = obj.created_at.substr(0, 4);
            eventCount[year][obj.type] += 1;

        });

    };

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

        // i get an object with org name,
        // use button state function
        // determine event state.

        // $('.subs').each(function () {
        //     debugger;
        //     var currentOrg = this.getAttribute('data-org');
        //
        //     if (subscribedOrgs[currentOrg]) {
        //         isSubscribed(this, true);
        //         sb.addEvent(this, 'click', unsubscribeHook);
        //
        //     } else {
        //         sb.addEvent(this, 'click', subscribeHook);
        //
        //     }
        //
        // });
    };

    return {
        init: function () {
            console.log("dash");
            panelTemplate = sb.template.panel();
            subscribeButtons();
            sb.listen({
                'github-events': this.createEventChart,
            });
            sb.listen({
                'user-subscriptions': this.subscribeButtons
            })
        },

        destroy: function () {

        },

        createEventChart: function (data) {
            createEventChart(data);
        },

        subscribeButtons: function (subs) {
            debugger;
            subscribeButtons(subs)
        }
    }
});