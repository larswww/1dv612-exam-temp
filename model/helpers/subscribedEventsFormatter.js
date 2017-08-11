'use strict';

// takes the array of events and returns a more useful string for notifications with pretty print
module.exports = eventsArray => {

    if (eventsArray.indexOf("*") >= 0) {
        return 'all events'
    } else {
        return [eventsArray.slice(0, -1).join(', '), eventsArray.slice(-1)[0]].join(eventsArray.length < 2 ? '' : ' & ');
    }

};
