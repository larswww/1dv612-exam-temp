'use strict';
const webpush = require('web-push');

let vapidKeys = webpush.generateVAPIDKeys();

console.log('Public key: ', vapidKeys.publicKey);
console.log('Private key: ', vapidKeys.privateKey);