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

       socket.on('user-prefs', function (prefs) {
           sb.notify({
               type: 'prefs-subscriptions',
               data: prefs.subscriptions
           })
       })

       socket.on('button-state', function (stateBool) {
           sb.notify({
               type: 'button-state',
               data: stateBool
           })
       })

   };

   var unsubscribe = function () {
       socket.emit('push-unsubscribe');
   };

   //todo could be DRYer
   var pushSubscription = function (subscription) {
       socket.emit('push-subscription', subscription);
   };
   
   var deleteHook = function (data) {
       socket.emit('delete-hook', data.org)
   };

   var createHook = function (hookUrl) {
       socket.emit('create-hook', {url: hookUrl});
   };

    return {
        init: function () {
            socket = sb.socket();
            socketController();
            sb.listen({
                'push-subscription': this.pushSubscription,
                'push-unsubscribe': this.unsubscribe,
                'delete-hook': this.deleteHook,
                'create-hook': this.createHook,
            });


        },
        
        destroy: function () {

        },

        pushSubscription: pushSubscription,
        unsubscribe: pushSubscription,
        createHook: createHook,
        deleteHook: deleteHook
    }


});