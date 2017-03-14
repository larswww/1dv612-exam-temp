(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
//var ioc = require('socket.io-client');
var Sandbox = require('./sandbox');

var CORE = (function () {
    var moduleData = {};
    var debug = true;
    var coreSocket = io('http://localhost:3001');

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
            } else {br
                // send to the server
            }
        },

        dom: {
            socket: function () {
                return coreSocket;
            },

            lock: function () {
                return new Auth0Lock('FxN8RQSXo1kNnWXfvFgTYn8ZtEy4esPc', 'lw222ii.auth0.com');

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

},{"./sandbox":9}],2:[function(require,module,exports){
var core = require('./core');
var Sandbox = require('./sandbox');
var authModule = require('./modules/auth');
var profileModule = require('./modules/profile');
var socketModule = require('./modules/socketController');
var dashboard = require('./modules/dashboard');
var handleClick = require('./modules/handleClick');
var createHook = require('./modules/createHook');
},{"./core":1,"./modules/auth":3,"./modules/createHook":4,"./modules/dashboard":5,"./modules/handleClick":6,"./modules/profile":7,"./modules/socketController":8,"./sandbox":9}],3:[function(require,module,exports){
'use strict';
var CORE = require('../core');

CORE.create_module('auth', function (sb) {
    var button;
    // var lock;
    // var userProfile;
    var userToken = localStorage.getItem('userToken');

    var userProfile = {
        clientID: "FxN8RQSXo1kNnWXfvFgTYn8ZtEy4esPc",
        collaborators: 0,
        created_at: "2017-03-08T15:21:17.598Z",
        disk_usage: 35702,
        email: "lw222ii@student.lnu.se",
        email_verified: true,
        emails: Array[1],
        events_url: "https://api.github.com/users/larswww/events{/privacy}",
        followers: 0,
        followers_url: "https://api.github.com/users/larswww/followers",
        following: 4,
        following_url: "https://api.github.com/users/larswww/following{/other_user}",
        gists_url: "https://api.github.com/users/larswww/gists{/gist_id}",
        global_client_id: "D1E9ltoHX3jSkCYKBFIjCmvcw06zBJmI",
        gravatar_id: "",
        html_url: "https://github.com/larswww",
        identities: Array[1],
        name: "lw222ii@student.lnu.se",
        nickname: "larswww",
        organizations_url: "https://api.github.com/users/larswww/orgs",
        owned_private_repos: 1,
        picture: "https://avatars2.githubusercontent.com/u/14055501?v=3",
        plan: Object,
        private_gists: 0,
        public_gists: 0,
        public_repos: 20,
        received_events_url: "https://api.github.com/users/larswww/received_events",
        repos_url: "https://api.github.com/users/larswww/repos",
        site_admin: false,
        starred_url: "https://api.github.com/users/larswww/starred{/owner}{/repo}",
        subscriptions_url: "https://api.github.com/users/larswww/subscriptions",
        total_private_repos: 1,
        two_factor_authentication: false,
        type: "User",
        updated_at: "2017-03-13T11:59:17.838Z",
        url: "https://api.github.com/users/larswww",
        user_id: "github|14055501"
    };


    var activateLock = function () {
        // console.log('lock activated');
        //
        // lock.on('authenticated', function (authResult) {
        //     lock.getProfile(authResult.idToken, function (error, profile) {
        //         if (error) {
        //             console.error(err);
        //             // Handle error
        //             return;
        //         }
        //         localStorage.setItem('userToken', authResult.idToken);
        //         userProfile = profile;
        //         userToken = authResult.idToken;
        //         debugger;
                activateSocket();
        //     });
        // });
        //
        // if (userToken) {
        //     lock.getProfile(userToken, function (err, profile) {
        //         if (err) {
        //             return alert('There was an error getting the profile: ' + err.message);
        //         }
        //         userProfile = profile;
        //         activateSocket();
        //     });
        // }

    };

    var activateSocket = function () {
        // var socket = io();
        //TODO get io from sb if you're going to use it here.
        sb.notify({
            type: 'logged-in',
            data: userProfile
        });

        sb.notify({
            type: 'socket-authenticate',
            data: userToken
        });


        // socket.on('connect', function () {
        //     socket
        //         .emit('authenticate', {token: userToken}) //send the jwt
        //         .on('authenticated', function () {
        //             console.log('client authenticated');
        //             socket.emit('authenticate', {token: userToken}) //send the jwt
        //
        //             //do other things
        //         })
        //         .on('unauthorized', function(msg) {
        //             console.log("unauthorized: " + JSON.stringify(msg.data));
        //             throw new Error(msg.data.type);
        //         })
        // });

        // socket.on('connect', function () {
        //     console.log('connect');
        //     socket.emit('test-message', {message: 'snel hesting 1 2 3'});
        //     socket.on('authenticated', function () {
        //         console.log('authenticated');
        //         //Do
        //
        //     })
        //         .emit('authenticate', {token: userToken}); // send the jwt
        //     console.log( {token: userToken });
        // });
    };

    let handleClick = function (e) {
        e.preventDefault();
        activateLock(); //normally called by lock.show()
        //lock.show();
    };


    return {
        init: function () {
            // lock = sb.lock();
            activateLock();
            button = sb.find('button')[0];
            sb.addEvent(button, 'click', handleClick);
        },

        destroy: function () {

        }
    };

});

},{"../core":1}],4:[function(require,module,exports){
'use strict';
var CORE = require('../core');

CORE.create_module('hooks', function (sb) {

    var createHook = function (hookUrl) {
        var socket = sb.socket();

        socket.emit('create-hook', {url: hookUrl})


    };


    return {
        init: function () {
            sb.listen({
                'create-hook': createHook
            })

        },

        destroy: function () {

        }
    }

});
},{"../core":1}],5:[function(require,module,exports){
'use strict';

var CORE = require('../core');

CORE.create_module('dashboard', function (sb) {
    var panelTemplate;

    var createEventChart = function (eventData) {
        var eventCount = {
            IssuesEvent: 0,
            CreateEvent: 0,
            PushEvent: 0,
            ReleaseEvent: 0
        };

        var data = {};

        var pushEvents;
        var releaseEvents;
        var createEvents;

        eventData.events.forEach(function (obj) {
            var year = obj.created_at.substr(0, 4);
            eventCount[year] = eventCount
        });

        eventData.events.forEach(function (obj) {
            var year = obj.created_at.substr(0, 4);
            eventCount[year][obj.type] += 1;

        });

    };

    var createOrganisations = function (orgs) {

        var panelDefault = $('<div class="panel panel-default">');
        var panelHeading = $('<div class="panel-heading">Your Organisations</div>');

        var orgList = $('<div class="panel-body"></div>');
        var orgNav = $('<ul class="nav nav-pills"></ul>');
        var orgContent = $('<div class="tab-content"></div>');

        orgs.data.forEach(function (orgObj) {
           var pill = $('<li><a href="#' + orgObj.login + '-pills" data-toggle="tab" aria-expanded="true">' + orgObj.login + '</a></li>');
           var desc = $('<div class="tab-pane fade active in" id="' + orgObj.login + '-pills"> <a href="' + orgObj.url +'">' + orgObj.login + '</a> <p>' + orgObj.description + '</p></div>')
            var subButton = $('<button type="button" class="btn btn-primary subs" data-org="' + orgObj.login + '" data-hook="'+ orgObj.hooks_url + '">Subscribe</button>')

            pill.appendTo(orgNav);
           subButton.appendTo(desc);
           desc.appendTo(orgContent);

        });

        orgNav.appendTo(orgList);
        orgContent.appendTo(orgList);
        panelHeading.appendTo(panelDefault);
        orgList.appendTo(panelDefault);

        console.log(orgList);
       $('#page-here').append(panelDefault);

       sb.notify({
           type: 'org-buttons'
       });
    };

    return {
        init: function () {
            console.log("dash");
            panelTemplate = sb.template.panel();
            sb.listen({
                'github-events': this.createEventChart,
                'github-organisations': this.createOrganisations
            })
        },

        destroy: function () {

        },

        createEventChart: function (data) {
            createEventChart(data);
        },

        createOrganisations: function (data) {
            createOrganisations(data);
        }


    }
});
},{"../core":1}],6:[function(require,module,exports){
'use strict';
var CORE = require('../core');

CORE.create_module('clickHandler', function (sb) {

    var interfaceClick = function (event) {
        event.preventDefault();
        event.stopPropagation();

        var hookUrl = event.currentTarget.getAttribute('data-hook');
        var org = event.currentTarget.getAttribute('data-org');

        sb.notify({
            type: 'create-hook',
            data: {
                url: hookUrl,
                org: org
            }
        })

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
                subButtons[i].addEventListener("click", interfaceClick);
            }

        }
    }
});
},{"../core":1}],7:[function(require,module,exports){
'use strict';

var CORE = require('../core');

CORE.create_module('logout', function (sb) {
    var loginButton;

    function loggedIn(data) {
        debugger;
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
},{"../core":1}],8:[function(require,module,exports){
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
},{"../core":1}],9:[function(require,module,exports){
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
