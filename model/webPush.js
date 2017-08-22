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
    let jsonPayload = JSON.stringify(notification);

    console.log('sending webpush: ');
    console.log(subscription);
    console.log(jsonPayload);

    webpush.sendNotification(JSON.parse(subscription), jsonPayload).then(result => {
        console.log('webpush.sendnotification result: ', result);
    }).catch(error => {
       console.error('webpush.sendnotification error: ', error);
    });
}

exports.subscribe = subscribeTo;
exports.toSubscriber = toSubscriber;