'use strict';
const webpush = require('web-push');
const dotenv = require('dotenv');
const notificationHelper = require('../model/helpers/notification');

dotenv.load();

// VAPID keys should only be generated only once.
// const vapidKeys = webpush.generateVAPIDKeys();
// console.log(vapidKeys.publicKey);
// console.log(vapidKeys.privateKey);

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

    let options = {
        headers: {
            "name": "value"
        }
    };

    let jsonPayload = JSON.stringify(notification);

    webpush.sendNotification(JSON.parse(subscription), jsonPayload, options)
}

//
//
// // This is the same output of calling JSON.stringify on a PushSubscription
// const pushSubscription = {
//     endpoint: '.....',
//     keys: {
//         auth: '.....',
//         p256dh: '.....'
//     }
// };
//
// webpush.sendNotification(pushSubscription, 'Your Push Payload Text');

exports.subscribe = subscribeTo;
exports.toSubscriber = toSubscriber;