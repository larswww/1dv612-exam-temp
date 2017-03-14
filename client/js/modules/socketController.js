'use strict';
var CORE = require('../core');

CORE.create_module('sockets', function (sb) {
   var socket;

   var socketController = function () {

       socket.on('connect', function () {
           console.log('socket connected');
           socket.emit('start');

       });

       socket.on('github', function (data) {
           console.log(data);
       });

       socket.on('github-events', function (data) {
           console.log('gh event socket controller');
           sb.notify({
               type: 'github-events',
               data: data
           })
       });

       socket.on('github-organisations', function (data) {
           console.log('git orgs');
           sb.notify({
               type: 'github-organisations',
               data: data
           })
       });
   };
    
    var onAuthenticate = function (data) {

        socket.on('authenticate')
        
    };
    
    return {
        init: function () {
            socket = sb.socket();
            socketController();
            sb.listen({
                'socket-authenticate': onAuthenticate
            })
            
        },
        
        destroy: function () {

        }
    }


});