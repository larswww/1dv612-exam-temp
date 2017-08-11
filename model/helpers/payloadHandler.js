'use strict';
const subscribedEventsFormatter = require('./subscribedEventsFormatter');


module.exports = function (event, payload) {

    //todo try catch and handling for missing methods and payload property errors.
    return formatNotification[event](payload);

};

let formatNotification = {

    commit_comment: payload => {

    },

    sub: payload => {
      return {
          title: 'Notifications activated',
          body: 'Change which organisations you receive notices for anytime.',
          icon: 'na',
          url: 'http://www.chinese5k.com'
      }
    },

    push: payload => {
        return {
            title: `Push to ${payload.repository.name} by ${payload.sender.login}`,
            body: payload.head_commit.message,
            icon: payload.sender.avatar_url,
            url: payload.compare
        }
    },

    ping: payload => {

        return {
            title: `Subscribed to ${subscribedEventsFormatter(payload.hook.events)} for ${payload.organization.login}`,
            body: `${payload.zen}`,
            icon: payload.organization.avatar_url,
            url: payload.organization.url,
        }
    }
};

// title
// body
// icon
// badge