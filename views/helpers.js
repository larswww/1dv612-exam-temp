'use strict';

module.exports = {
    helpers: {
        titleOrOrg: org => {
            return org.description === '' ? org.login : org.description;
        }
    },

    defaultLayout: 'main'
};