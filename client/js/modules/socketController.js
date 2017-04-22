'use strict';
var CORE = require('../core');

CORE.create_module('sockets', function (sb) {
   var socket;

   var socketController = function () {

       socket.on('connect', function () {
           console.log('socket connected');
           socket.emit('start');

       });

       socket.on('octonode', function (data) {
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
           debugger;
           sb.notify({
               type: 'github-organisations',
               data: data
           })
       });

       socket.on('org-repos', function (data) {
           console.log('org-repos', data);
       });
   };
    
    var onAuthenticate = function (profile) {
        socket.emit('authenticated', profile)
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