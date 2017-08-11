'use strict';
var CORE = require('../core');

CORE.create_module('sockets', function (sb) {
   var socket;

   var socketController = function () {

       socket.on('connect', function () {
           console.log('socket connected');
           socket.emit('base-req', {});

       });

       socket.on('github-events', function (data) {
           sb.notify({
               type: 'github-events',
               data: data
           })
       });

       socket.on('github-organisations', function (data) {
           sb.notify({
               type: 'github-organisations',
               data: data
           })
       });

       socket.on('org-repos', function (data) {
           console.log('org-repos', data);
       });

       socket.on('hook-created', function (data) {
          console.log('hook-created', data)
       });

       socket.on('user-subscriptions', function (data) {
          console.log(data);

       });
   };

   var pushSubscription = function (subscription) {
       debugger;
       socket.emit('push-subscription', subscription);
   };

    return {
        init: function () {
            socket = sb.socket();
            socketController();
            sb.listen({
                'push-subscription': pushSubscription
            })
        },
        
        destroy: function () {

        }
    }


});