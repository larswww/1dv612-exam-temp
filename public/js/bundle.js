(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
//var ioc = require('socket.io-client');
var Sandbox = require('./sandbox');

var CORE = (function () {
    var moduleData = {};
    var debug = true;
    var coreSocket = io();

    return {
        debug: function (on) {
            debug = on ? true : false;
        },

        create_module: function (moduleID, creator) {
            var temp;
            if (typeof moduleID === 'string' && typeof creator === 'function') {
                temp = creator(Sandbox.create(this, moduleID));
                if (temp.init && typeof temp.init === 'function' && temp.destroy && typeof temp.destroy === 'function') {
                    temp = null;
                    moduleData[moduleID] = {
                        create: creator,
                        instance: null,
                    };
                    this.start(moduleID);
                } else {
                    this.log(1, 'Module "' + moduleID + '" Registration: FAILED: instance has no init or destroy functions');
                }
            } else {
                this.log(1, 'Module "' + moduleID + '" Registration: FAILED: one or more arguments are of incorrect type');

            }
        },

        start: function (moduleID) {
            var mod = moduleData[moduleID];
            if (mod) {
                mod.instance = mod.create(Sandbox.create(this, moduleID));
                mod.instance.init();
            }
        },

        start_all: function () {
            var moduleID;
            for (moduleID in moduleData) {
                if (moduleData.hasOwnProperty(moduleID)) {
                    this.start(moduleID);
                }
            }
        },

        stop: function (moduleID) {
            var data;
            if (data = moduleData[moduleID] && data.instance) {
                data.instance.destroy();
                data.instance = null;
            } else {
                this.log(1, "Stop Module '" + moduleID + "': FAILED : module does not exist or has not been started");
            }
        },

        stop_all: function () {
            var moduleID;
            for (moduleID in moduleData) {
                if (moduleData.hasOwnProperty(moduleID)) {
                    this.stop(moduleID);
                }
            }
        },

        registerEvents: function (evts, mod) {
            if (this.is_obj(evts) && mod) {
                if (moduleData[mod]) {
                    moduleData[mod].events = evts;
                } else {
                    this.log(1, '');
                }
            } else {
                this.log(1, '');
            }
        },

        triggerEvent: function (evt) {
            var mod;
            for (mod in moduleData) {
                if (moduleData.hasOwnProperty(mod)) {
                    mod = moduleData[mod];
                    if (mod.events && mod.events[evt.type]) {
                        mod.events[evt.type](evt.data);
                    }
                }
            }
        },

        removeEvents: function (evts, mod) {
            var i = 0, evt;
            if (this.is_arr(evts) && mod && (mod = moduleData[mod]) && mod.events) {
                for (; evt = evts[i++];) {
                    delete mod.events[evt];
                }
            }
        },

        log: function (severity, message) {
            if (debug) {
                console[(severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message);
            } else {
                // send to the server
            }
        },

        dom: {
            socket: function () {
                return coreSocket;
            },

            chart: function (type, settings) {
                return new Morris[type](settings);
            },

            query: function (selector, context) {

                var ret = {};
                var that = this;
                var jqEls;
                var i = 0;

                if (context && context.find) {
                    jqEls = context.find(selector);
                } else {
                    jqEls = $(selector);
                }

                ret = jqEls.get();
                ret.length = jqEls.length;
                ret.query = function (sel) {
                    return that.query(sel, jqEls);
                };
                return ret;
            },

            bind: function (element, evt, fn) {
                if (element && evt) {
                    if (typeof evt === 'function') {
                        fn = evt;
                        evt = 'click';
                    }
                    jQuery(element).bind(evt, fn);
                } else {
                    // log wrong arguments
                }
            },
            unbind: function (element, evt, fn) {
                if (element && evt) {
                    if (typeof evt === 'function') {
                        fn = evt;
                        evt = 'click';
                    }
                    jQuery(element).unbind(evt, fn);
                } else {
                    // log wrong arguments
                }
            },

            create: function (el) {
                return document.createElement(el);
            },

            apply_attrs: function (el, attrs) {
                jQuery(el).attr(attrs);
            }
        },

        is_arr: function (arr) {
            return jQuery.isArray(arr);
        },
        is_obj: function (obj) {
            return jQuery.isPlainObject(obj);
        }

    };

}());

module.exports = CORE;

},{"./sandbox":8}],2:[function(require,module,exports){
var core = require('./core');
var Sandbox = require('./sandbox');
var profileModule = require('./modules/profile');
var socketModule = require('./modules/socketController');
var dashboard = require('./modules/dashboard');
var handleClick = require('./modules/handleClick');
var serviceWorker = require('./modules/serviceWorker');
},{"./core":1,"./modules/dashboard":3,"./modules/handleClick":4,"./modules/profile":5,"./modules/serviceWorker":6,"./modules/socketController":7,"./sandbox":8}],3:[function(require,module,exports){
'use strict';

var CORE = require('../core');

CORE.create_module('dashboard', function (sb) {

    //todo pause state button

    var subButtonInfo = function (event) {

        event.preventDefault();
        event.stopPropagation();

        return {
            hookUrl: event.currentTarget.getAttribute('data-hook'),
            org: event.currentTarget.getAttribute('data-org')
        };
    };

    var subscribeHook = function (event) {

        sb.notify({
            type: 'create-hook',
            data: subButtonInfo(event)
        });

        sb.removeEvent(event.currentTarget, 'click', subscribeHook);
        sb.addEvent(event.currentTarget, 'click', unsubscribeHook);
        subscribed(true, event.currentTarget);
    };

    var unsubscribeHook = function (event) {

        sb.notify({
            type: 'delete-hook',
            data: subButtonInfo(event)
        });

        sb.removeEvent(event.currentTarget, 'click', unsubscribeHook);
        sb.addEvent(event.currentTarget, 'click', subscribeHook);
        subscribed(false, event.currentTarget);
    };

    var subscribeButtons = function () {

        $('.subs').each(function () {
            sb.addEvent(this, 'click', subscribeHook);
        });

        $('.unsubs').each(function () {
            sb.addEvent(this, 'click', unsubscribeHook);
        });

    };

    var subscribed = function (bool, target) {

        if (bool) {
            target.className = 'btn btn-danger unsubs';
            target.innerText = 'Unsubscribe';

        } else {
            target.className = 'btn btn-primary subs';
            target.innerText = 'Subscribe';
        }
    };

    return {
        init: function () {
            subscribeButtons();
        },

        destroy: function () {

        },
    }
});
},{"../core":1}],4:[function(require,module,exports){
'use strict';
var CORE = require('../core');

CORE.create_module('clickHandler', function (sb) {

    var subscribeHook = function (event) {
        event.preventDefault();
        event.stopPropagation();

        var hookUrl = event.currentTarget.getAttribute('data-hook');
        var org = event.currentTarget.getAttribute('data-org');

        debugger;

        sb.notify({
            type: 'create-hook',
            data: {
                url: hookUrl,
                org: org
            }
        });

        sb.removeEvent(event.currentTarget, 'click', subscribeHook);
    };


    return {
        init: function () {
            sb.listen({
                'org-buttons': this.orgButtons
            });

        },

        destroy: function () {

        },

        orgButtons: function () {
            var subButtons = $('button.subs');

            for (var i = 0; i < subButtons.length; i += 1) {

                sb.addEvent(subButtons[i], 'click', subscribeHook);
            }

        }
    }
});
},{"../core":1}],5:[function(require,module,exports){
'use strict';

var CORE = require('../core');

CORE.create_module('logout', function (sb) {
    var loginButton;

    function loggedIn(data) {
        var template = $('#template-login')[0].content.children;
        var shortname = template["0"].children["0"].childNodes[3];
        var fullname = template["0"].childNodes[3].childNodes[1].children["0"].children["0"].children[1].children["0"];
        var email = template["0"].childNodes[3].childNodes[1].children["0"].children["0"].children[1].children[1];
        var profileButton = template["0"].childNodes[3].childNodes[1].children["0"].children["0"].children[1].children[2].children["0"];
        var logoutButton = template["0"].children[1].children[2].children["0"].children["0"].children["0"].children["0"].children["0"];

        //TODO where to get the full name?
        shortname.textContent = data.nickname;
        email.textContent = data.email;
        profileButton.href = data.html_url;

        $('#auth').html(template);
        sb.addEvent(logoutButton, 'click', logOut);

//grab template
        // populate with data
        // append to

    }


    function logOut(e) {
        e.preventDefault();
        //TODO logout?
        $('#auth').html(loginButton);

    }

    return {
        init: function () {
            loginButton = $('#auth')[0];
            sb.listen({
                'logged-in': this.loggedIn,
                'log-out': this.logOut
            });
        },

        destroy: function () {

            // change it back to the login button.

        },

        loggedIn: function (data) {
            loggedIn(data);

        },

        logOut: function (event) {
            logOut(event);
        }
    }

});
},{"../core":1}],6:[function(require,module,exports){
'use strict';

var CORE = require('../core');

CORE.create_module('serviceWorker', function (sb) {

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
},{"../core":1}],7:[function(require,module,exports){
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
                'delete-hook': this.deleteHook,
                'create-hook': this.createHook
            });


        },
        
        destroy: function () {

        },

        pushSubscription: pushSubscription,
        createHook: createHook,
        deleteHook: deleteHook
    }


});
},{"../core":1}],8:[function(require,module,exports){
'use strict';

var Sandbox = {
    create: function (core, module_selector) {
          var CONTAINER = core.dom.query('#' + module_selector);
          return {

              find: function (selector) {
                  return CONTAINER.query(selector);
                },

              addEvent: function (element, evt, fn) {
                  core.dom.bind(element, evt, fn);
                },

              removeEvent: function (element, evt, fn) {
                  core.dom.unbind(element, evt, fn);
                },

              notify: function (evt) {
                  if (core.is_obj(evt) && evt.type) {
                    core.triggerEvent(evt);
                  }
                },

              listen: function (evts) {
                  if (core.is_obj(evts)) {
                    core.registerEvents(evts, module_selector);
                  }
                },

              ignore: function (evts) {
                  if (core.is_arr(evts)) {
                    core.removeEvents(evts, module_selector);
                  }
                },

              create_element: function (el, config) {
                  var i;
                  var text;
                  el = core.dom.create(el);
                  if (config) {
                    if (config.children && core.is_arr(config.children)) {
                      i = 0;
                      while (config.children[i]) {
                        el.appendChild(config.children[i])
                        ;
                        i++;
                      }

                      delete config.children;
                    } else if (config.text) {
                      text = document.createTextNode(config.text);
                      delete config.text;
                      el.appendChild(text);
                    }

                    core.dom.apply_attrs(el, config);
                  }

                  return el;
                },

              socket: function () {
                  return core.dom.socket();
                },

              lock: function () {
                  return core.dom.lock();
              },

              chart: function () {

              },

              template: {

                  panel: function () {
                      return $('#template-panel')
                  }
              },

            };
        },
  };

module.exports = Sandbox;

},{}]},{},[2]);
