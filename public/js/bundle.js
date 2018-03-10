(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
//var ioc = require('socket.io-client');
var Sandbox = require('./facade');

var CORE = (function () {
    var moduleData = {};
    var debug = true;
    // var coreSocket = io();

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

        moment: function (time) {
          return moment().fromNow(time)
        },

        log: function (severity, message) {
            if (debug) {
                console[(severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message);
            } else {
                // send to the server
            }
        },

        dom: {
            append_element: function (selector, elementString) {
                jQuery(selector).append(elementString)
            },

            remove: function (selector) {
                jQuery(selector).remove()
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
            },


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

},{"./facade":2}],2:[function(require,module,exports){
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

            append_elements: function (selector, array) {
                var elements = array.join('\n')
                core.dom.append_element(selector, elements)

            },

            remove_element: function (selector) {
              core.dom.remove(selector)
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

            timeSince: function (time) {
                return core.moment(time)

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

},{}],3:[function(require,module,exports){
var core = require('./core');
var Sandbox = require('./facade');
// var socketModule = require('./modules/socketController');
var dashboard = require('./modules/subscribeButtons');
var loading = require('./modules/loading')
var REST = require('./modules/REST')
var notifications = require('./modules/notifications')
var stats = require('./modules/stats')
var settings = require('./modules/settings')
//var serviceWorker = require('./modules/webPushButton')
},{"./core":1,"./facade":2,"./modules/REST":4,"./modules/loading":5,"./modules/notifications":6,"./modules/settings":7,"./modules/stats":8,"./modules/subscribeButtons":9}],4:[function(require,module,exports){
'use strict';
var CORE = require('../core');

CORE.create_module('REST', function (sb) {
    var connectionUrl = 'http://localhost:3000'
    var loadAtStartup = ['settings', 'notifications', 'stats']

    var requestAll = function() {
        for (var item of loadAtStartup) {
            sb.notify({type: 'start-loading', data: {selector: `#${item}`, target: 'h3'}})
            ajaxRequest(item)
        }
    }

    var ajaxRequest = function (event) {
        $.get(`${connectionUrl}/api/${event}`, function (data) {
            sb.notify({type: event, data: data.data}) //ffs
        })
    }

    return {
        init: function () {
            requestAll();
            sb.listen({
                'ajax-request': this.ajaxRequest,
            });


        },

        destroy: function () {

        },

        ajaxRequest: ajaxRequest,
    }
});
},{"../core":1}],5:[function(require,module,exports){
'use strict'

var CORE = require('../core');

CORE.create_module('loading', function (sb) {

    var start = function (event) {
        var loaderIcon = `<i class="fas fa-spinner fa-spin" id='${event.selector}Loading'style="font-size:24px"></i>`
        sb.append_elements(`${event.selector} > ${event.target}`, [loaderIcon])
    }

    var stop = function (event) {
        sb.remove_element(`${event.selector}Loading`)
    }

    return {
        init: function () {
            sb.listen({
                'start-loading': start

            })
            sb.listen({
                'stop-loading': stop
            })
        },

        destroy: function () {

        },
    }
})
},{"../core":1}],6:[function(require,module,exports){
'use strict';
var CORE = require('../core')

CORE.create_module('notifications', function (sb) {
    var selector = '#notifications'

    var receivedNotifications = function (data) {
        for (let item of data) {
            try {
                addNotification(item)
            } catch (e) {
                console.error('receivedNotifications: invalid notification,', item)
            }
        }

        sb.notify({type: 'stop-loading', data: {selector: selector, target: 'h3'}})
    }


    var addNotification = function (item) {
        let html = ['<div class="card ">',
            '<div class="card-body">',
            `<h5 class="card-title">${item.title}</h5>`,
            `<small class="text-muted">${sb.timeSince(item.date)}</small>`,
            `<div class="clearfix">`,
            `<img src="${item.icon}" class="rounded float-left w-25" alt="...">`,
            `<p class="card-text float-right">${item.body.trim()}</p>`,
            `</div>`,
            `<a href="${item.url}" class="card-link">...${item.url.slice(-40)}</a>`,
            '</div>',
            '</div>']

        sb.append_elements(`${selector}`, html)
    }

    return {
        init: function () {
            sb.notify({type: 'start-loading', data: {selector: selector, target: 'h3'}})
            sb.listen({
                'notifications': receivedNotifications //todo is it necessary to make it this.buttonState???

            })
        },

        destroy: function () {

        },
    }
})
},{"../core":1}],7:[function(require,module,exports){
'use strict';

var CORE = require('../core');

CORE.create_module('settings', function (sb) {
    var selector = '#settings'

    var recievedSettings = function (data) {
        console.log('recieved settings ', data)
    }

    return {
        init: function () {
            sb.notify({type: 'start-loading', data: {selector: selector, target: 'h3'}})
            sb.listen({
                'settings': recievedSettings //todo is it necessary to make it this.buttonState???

            })
        },



        destroy: function () {

        },
    }
})
},{"../core":1}],8:[function(require,module,exports){
'use strict';

var CORE = require('../core')

CORE.create_module('stats', function (sb) {
    var selector = '#stats'

    var recievedSettings = function (data) {
        console.log('recieved stats ', data)
        updateStats(data)
        sb.notify({type: 'stop-load', data: selector})
    }

    var updateStats = function (data) {
        if (data['orgs'].length) createGithubStatsListItem({name: 'Organizations', length: data['orgs'].length})
        if (data['issues'].length) createGithubStatsListItem({name: 'Issues', length: data['issues'].length})
        if (data['teams'].length) createGithubStatsListItem({name: 'Teams', length: data['teams'].length})
        if (data['repos'].length) createGithubStatsListItem({name: 'Repositories', length: data['repos'].length})
    }

    var createGithubStatsListItem = function (item) {
        let html = [`<li class="list-group-item d-flex justify-content-between align-items-center">`,
            `${item.name}`,
            `<span class="badge badge-primary badge-pill">${item.length}</span>`,
            `</li>`]

        sb.append_elements(`${selector} > ul`, html)
    }

    //test

    return {
        init: function () {
            sb.listen({
                'stats': recievedSettings // todo is it necessary to make it this.buttonState ?

            })
        },


        destroy: function () {

        },
    }
})
},{"../core":1}],9:[function(require,module,exports){
'use strict';

var CORE = require('../core');

CORE.create_module('subscribeButtons', function (sb) {
    let theButton; //todo never undisables if clicking more than one button quickly.

    var subButtonInfo = function (event) {

        event.preventDefault();
        event.stopPropagation();

        return {
            hookUrl: event.currentTarget.getAttribute('data-hook'),
            org: event.currentTarget.getAttribute('data-org')
        };
    };

    var subscribeHook = function (event) {
        buttonState(false, event.currentTarget);

        sb.notify({
            type: 'create-hook',
            data: subButtonInfo(event)
        });

        sb.removeEvent(event.currentTarget, 'click', subscribeHook);
        sb.addEvent(event.currentTarget, 'click', unsubscribeHook);
        subscribed(true, event.currentTarget);
    };

    var unsubscribeHook = function (event) {
        buttonState(false, event.currentTarget);

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

    var buttonState = function (stateBool, button) {

        if (stateBool) {
            theButton.disabled = false;

        } else {
            theButton = button;
            theButton.disabled = true;

        }
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
            sb.listen({
                'button-state': buttonState //todo is it necessary to make it this.buttonState???

            })
        },



        destroy: function () {

        },
    }
});
},{"../core":1}]},{},[3]);
