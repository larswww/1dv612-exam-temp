'use strict';
const eventsAndPayloads = require('../model/helpers/payloadTypesAndSamples');


module.exports = {
    helpers: {
        titleOrOrg: org => {
            return org.description === '' ? org.login : org.description;
        },

        subOrNot: (login, hooks) => {
            let subs = {};

            hooks.forEach(hook => {
                subs[hook.login] = hook.login;
            });

            return !!subs[login.login];
        },

        debug: (data, breakpoint) => {
            console.log(data);
            console.log(this);
            if (breakpoint === true) {
                debugger;
            }
            return '';
        },

        events: eventsAndPayloads,
    },

    defaultLayout: 'main'
};