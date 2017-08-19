'use strict';

module.exports = (resArray) => {
    console.log(resArray);
    // 0 = notifications
    // 1 = subscriptions

    return {
        notifications: resArray[0],
        subscriptions: resArray[1]._doc.hooks
    }

};