'use strict';
let url;

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
    console.log(event);

    let payload = safelyParse(event.data.text());

    if (payload) {
        url = payload.notification.url;

        const title = payload.notification.title;
        const options = {
            body: payload.notification.body,
            icon: payload.notification.icon,
            badge: 'images/badge.png'
        };

        event.waitUntil(self.registration.showNotification(title, options));


    }
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');
    console.log(event);

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://github.larsw.net')
    );
});


function safelyParse(hopefullyJSON) {

    try {
        return JSON.parse(hopefullyJSON);
    } catch (e) {
        return false;
    }

}