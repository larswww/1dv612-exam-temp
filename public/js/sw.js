self.addEventListener('push', function(event) {
    debugger;
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
    console.log(event);


    const title = 'Github Notification';
    const options = {
        body: `'${event.data.text()}'`,
        icon: 'images/icon.png',
        badge: 'images/badge.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');
    console.log(event);

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://chinese5k.com')
    );
});