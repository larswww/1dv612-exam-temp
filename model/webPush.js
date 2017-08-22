'use strict';
const webpush = require('web-push');
const dotenv = require('dotenv');

dotenv.load();

webpush.setGCMAPIKey(process.env.GCM_API_KEY);

webpush.setVapidDetails(
    'mailto:lw222ii@student.lnu.se',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

let subscribeTo = function (subscription) {
    webpush.sendNotification(subscription, 'your push payload text');

};

function toSubscriber(subscription, notification) {
    console.log(subscription);

    let jsonPayload = JSON.stringify(notification);

    console.log(jsonPayload);

    webpush.sendNotification(JSON.parse(subscription), jsonPayload).then(result => {
        console.log(result);
    }).catch(error => {
       console.error(error);
    });
}

exports.subscribe = subscribeTo;
exports.toSubscriber = toSubscriber;