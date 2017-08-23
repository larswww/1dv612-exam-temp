'use strict';

var CORE = require('../core');

CORE.create_module('webPushButton', function (sb) {

    const applicationServerPublicKey = 'BFKuHah3AIxUe0oXiWLeXJ8Yv79wmXRgHgjG2xKjymIuueQICb5E5OIUvAW033bvmfBaZi856_BhByhayfX1yFs';
    // localhost: const applicationServerPublicKey = 'BIslP8UZWMbRU3RjFFaVfM5-c2jqXw1eno9TVwjt69cJPHwbbtpNYaa99E6CHJ7o4ZPPZhvR5e6fOVa5KyLwg1I';

    const pushButton = document.querySelector('.js-push-btn');

    let isSubscribed = false;
    let swRegistration = null;

    function urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    function updateBtn() {

        if (Notification.permission === 'denied') {
            pushButton.textContent = 'Push Messaging Blocked.';
            pushButton.disabled = true;
            updateSubscriptionOnServer(null);
            return;
        }

        if (isSubscribed) {
            pushButton.textContent = 'Disable Push Messaging';
        } else {
            pushButton.textContent = 'Enable Push Messaging';
        }

        pushButton.disabled = false;
    }

    function initialiseUI() {
        pushButton.addEventListener('click', function() {
            pushButton.disabled = true;
            if (isSubscribed) {
                // TODO: Unsubscribe user
            } else {
                subscribeUser();
            }
        });

        // Set the initial subscription value
        swRegistration.pushManager.getSubscription()
            .then(function(subscription) {
                isSubscribed = !(subscription === null);

                updateSubscriptionOnServer(subscription);

                if (isSubscribed) {
                    console.log('User IS subscribed.');
                } else {
                    console.log('User is NOT subscribed.');
                }

                updateBtn();
            });
    }

    function subscribeUser() {
        const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
        swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
            .then(function(subscription) {
                console.log('User is subscribed');

                updateSubscriptionOnServer(subscription);

                isSubscribed = true;

                updateBtn();
            })
            .catch(function(err) {
                console.log('Failed to subscribe the user: ', err);
                updateBtn();
            });
    }

    function updateSubscriptionOnServer(subscription) {

        const subscriptionJson = document.querySelector('.js-subscription-json');
        const subscriptionDetails =
            document.querySelector('.js-subscription-details');

        if (subscription) {

            sb.notify({
                type: 'push-subscription',
                data: subscription
            });

            subscriptionJson.textContent = JSON.stringify(subscription);
            subscriptionDetails.classList.remove('is-invisible');
        } else {
            subscriptionDetails.classList.add('is-invisible');
        }
    }


    var startWorker = function () {

        if ('serviceWorker' in navigator && 'PushManager' in window) {
            console.log('Service Worker and Push is supported');

            navigator.serviceWorker.register('/public/js/sw.js')
                .then(function(swReg) {
                    console.log('Service Worker is registered', swReg);

                    swRegistration = swReg;
                    initialiseUI();
                })
                .catch(function(error) {
                    console.error('Service Worker Error', error);
                });
        } else {
            console.warn('Push messaging is not supported');
            pushButton.textContent = 'Push Not Supported';
        }
        
    };
    
    
    return {
        init: function () {
            startWorker();
        },
        
        destroy: function () {
            
        }
    }

    

});