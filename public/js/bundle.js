(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict'

//live
//const connectionUrl = 'https://github.larsw.net/api/'

// local
const connectionUrl = 'http://localhost:3000/api/'

var Sandbox = require('./facade')

var CORE = (function () {
  var moduleData = {}
  var debug = true

  return {
    debug: function (on) {
      debug = on ? true : false
    },

    create_module: function (moduleID, creator) {
      var temp
      if (typeof moduleID === 'string' && typeof creator === 'function') {
        temp = creator(Sandbox.create(this, moduleID))
        if (temp.init && typeof temp.init === 'function' && temp.destroy && typeof temp.destroy === 'function') {
          temp = null
          moduleData[moduleID] = {
            create: creator,
            instance: null,
          }
          this.start(moduleID)
        } else {
          this.log(1, 'Module "' + moduleID + '" Registration: FAILED: instance has no init or destroy functions')
        }
      } else {
        this.log(1, 'Module "' + moduleID + '" Registration: FAILED: one or more arguments are of incorrect type')

      }
    },

    start: function (moduleID) {
      var mod = moduleData[moduleID]
      if (mod) {
        mod.instance = mod.create(Sandbox.create(this, moduleID))
        mod.instance.init()
      }
    },

    start_all: function () {
      var moduleID
      for (moduleID in moduleData) {
        if (moduleData.hasOwnProperty(moduleID)) {
          this.start(moduleID)
        }
      }
    },

    stop: function (moduleID) {
      var data
      if (data = moduleData[moduleID] && data.instance) {
        data.instance.destroy()
        data.instance = null
      } else {
        this.log(1, 'Stop Module \'' + moduleID + '\': FAILED : module does not exist or has not been started')
      }
    },

    stop_all: function () {
      var moduleID
      for (moduleID in moduleData) {
        if (moduleData.hasOwnProperty(moduleID)) {
          this.stop(moduleID)
        }
      }
    },

    registerEvents: function (evts, mod) {
      if (this.is_obj(evts) && mod) {
        if (moduleData[mod]) {
          moduleData[mod].events = evts
        } else {
          this.log(1, '')
        }
      } else {
        this.log(1, '')
      }
    },

    triggerEvent: function (evt) {
      var mod
      for (mod in moduleData) {
        if (moduleData.hasOwnProperty(mod)) {
          mod = moduleData[mod]
          if (mod.events && mod.events[evt.type]) {
            mod.events[evt.type](evt.data)
          }
        }
      }
    },

    removeEvents: function (evts, mod) {
      var i = 0, evt
      if (this.is_arr(evts) && mod && (mod = moduleData[mod]) && mod.events) {
        for (; evt = evts[i++];) {
          delete mod.events[evt]
        }
      }
    },

    moment: function (time) {
      return moment(time).fromNow()
    },

    request: function (type, endpoint, callback, payload) {
      let url = `${connectionUrl}${endpoint}`
      let ajaxConfig = {
        method: type,
        url: url,
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json',
        data: payload
      }

      if (debug) {
        ajaxConfig.error = function (xhr, textStatus, errorThrown) {
          console.error(xhr, textStatus, errorThrown)
        }
      }

      jQuery.ajax(url, ajaxConfig).done(function (data) {
        callback(null, data)
      })
    },

    chart: function (selector, options) {
      var ctx = document.getElementById(`${selector}Chart`)
      var myChart = new Chart(ctx, options)
    },

    log: function (severity, message) {
      if (debug) {
        console[(severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message)
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

      cookie: function () {
        return document.cookie
      },

      findOne: function (selector) {
        return document.querySelector(selector)
      },

      query: function (selector, context) {

        var ret = {}
        var that = this
        var jqEls
        var i = 0

        if (context && context.find) {
          jqEls = context.find(selector)
        } else {
          jqEls = $(selector)
        }

        ret = jqEls.get()
        ret.length = jqEls.length
        ret.query = function (sel) {
          return that.query(sel, jqEls)
        }
        return ret
      },

      bind: function (element, evt, fn) {
        if (element && evt) {
          if (typeof evt === 'function') {
            fn = evt
            evt = 'click'
          }
          jQuery(element).bind(evt, fn)
        } else {
          // log wrong arguments
        }
      },
      unbind: function (element, evt, fn) {
        if (element && evt) {
          if (typeof evt === 'function') {
            fn = evt
            evt = 'click'
          }
          jQuery(element).unbind(evt, fn)
        } else {
          // log wrong arguments
        }
      },

      create: function (el) {
        return document.createElement(el)
      },

      apply_attrs: function (el, attrs) {
        jQuery(el).attr(attrs)
      },

    },

    is_arr: function (arr) {
      return jQuery.isArray(arr)
    },
    is_obj: function (obj) {
      return jQuery.isPlainObject(obj)
    }

  }

}())

module.exports = CORE

},{"./facade":2}],2:[function(require,module,exports){
'use strict'

var Sandbox = {
  create: function (core, module_selector) {
    var CONTAINER = core.dom.query(module_selector)

    return {

      find: function (selector) {
        return CONTAINER.query(selector)
      },

      findOne: function (selector) {
        return core.dom.findOne(selector)
      },

      addEvent: function (element, evt, fn) {
        core.dom.bind(element, evt, fn)
      },

      removeEvent: function (element, evt, fn) {
        core.dom.unbind(element, evt, fn)
      },

      notify: function (evt) {
        if (core.is_obj(evt) && evt.type) {
          core.triggerEvent(evt)
        }
      },

      listen: function (evts) {
        if (core.is_obj(evts)) {
          core.registerEvents(evts, module_selector)
        }
      },

      ignore: function (evts) {
        if (core.is_arr(evts)) {
          core.removeEvents(evts, module_selector)
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
        var i
        var text
        el = core.dom.create(el)
        if (config) {
          if (config.children && core.is_arr(config.children)) {
            i = 0
            while (config.children[i]) {
              el.appendChild(config.children[i])

              i++
            }

            delete config.children
          } else if (config.text) {
            text = document.createTextNode(config.text)
            delete config.text
            el.appendChild(text)
          }

          core.dom.apply_attrs(el, config)
        }

        return el
      },

      socket: function () {
        return core.dom.socket()
      },

      lock: function () {
        return core.dom.lock()
      },

      get: function (endpoint, callback) {
        core.request('GET', endpoint, callback)
      },

      getCookie: function (name) {
        let cookies = core.dom.cookie()
        try {
          let cookie = cookies.split(`${name}=`)[1].split(';')[0]
          return cookie
        } catch (e) {
          if (debug) console.error(`Could not get cookie for ${name}`)
          return false
        }
      },

      post: function (endpoint, data, callback) {
        if (!callback) {
          callback = function (err, res) {
            if (err) {
              console.error(err)
            } else {
              console.log(endpoint, res.status)
            }
          }
        }

        data = JSON.stringify(data)
        core.request('POST', endpoint, callback, data)
      },

      chart: function (selector, options) {
        core.dom.append_element(selector, `<canvas id="${selector}Chart" width="400" height="400"></canvas>`)
        core.chart(selector, options)

      },

      timeSince: function (time) {
        return core.moment(time)

      },

      template: {

        panel: function () {
          return $('#template-panel')
        }
      },

    }
  },
}

module.exports = Sandbox

},{}],3:[function(require,module,exports){
var core = require('./core');
var Sandbox = require('./facade');
var loading = require('./modules/loading')
var REST = require('./modules/REST')
var notifications = require('./modules/notifications')
var stats = require('./modules/stats')
var charts = require('./modules/charts')
var settings = require('./modules/settings')
var serviceWorker = require('./modules/webPushButton')
},{"./core":1,"./facade":2,"./modules/REST":4,"./modules/charts":5,"./modules/loading":6,"./modules/notifications":7,"./modules/settings":8,"./modules/stats":9,"./modules/webPushButton":10}],4:[function(require,module,exports){
'use strict';
var CORE = require('../core');

CORE.create_module('REST', function (sb) {
    var loadAtStartup = ['settings', 'notifications', 'stats']

    var requestAll = function() {
        for (var item of loadAtStartup) {
            sb.notify({type: 'start-loading', data: {selector: `${item}`, target: 'h3'}})
            ajaxRequest(item)
        }
    }

    var ajaxRequest = function (event) {
        sb.get(event, function (err, data) {
          sb.notify({type: 'stop-loading', data: event})
          if (!err) sb.notify({type: event, data: data.data}) //ffs
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

var CORE = require('../core')

CORE.create_module('charts', function (sb) {
  var selector = '#stats'

  var notificationsChart = function (event) {
    let eventCount = {}

    for (let noticeObj of event) {
      if (!eventCount[noticeObj.event]) eventCount[noticeObj.event] = 0
      eventCount[noticeObj.event] += 1
    }

    let labels = []
    let count = []

    for (let label in eventCount) {
      labels.push(label)
      count.push(eventCount[label])
    }

    let colors = []
    for (let i of labels) {
      colors.push(dynamicColors())
    }

    const data = {
      labels: labels,
      datasets: [{
        label: 'Event Types in your Organizations',
        data: count,
        backgroundColor: colors
      }]
    }

    const options = {
      type: 'pie',
      data: data,
    }


    sb.chart(selector, options)

  }

  //https://jsfiddle.net/5kLbasqp/26/
  var dynamicColors = function() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  // once done pass each data obj into chart gen
  return {
    init: function () {
      sb.listen({
        'notifications': notificationsChart,
      })
    },

    destroy: function () {

    },
  }
})
},{"../core":1}],6:[function(require,module,exports){
'use strict'

var CORE = require('../core')

CORE.create_module('loading', function (sb) {

  var start = function (event) {
    var loaderIcon = [` <i class="fas fa-spinner fa-spin" id='${event.selector}Loading' style="font-size:24px"></i>`]
    sb.append_elements(`#${event.selector} > ${event.target}`, loaderIcon)
  }

  var stop = function (event) {
    sb.remove_element(`#${event}Loading`)
  }

  return {
    init: function () {
      sb.listen({
        'start-loading': start,
        'stop-loading': stop
      })
    },

    destroy: function () {

    },
  }
})
},{"../core":1}],7:[function(require,module,exports){
'use strict'
var CORE = require('../core')

CORE.create_module('notifications', function (sb) {
  var selector = '#notifications'

  var receivedNotifications = function (data) {
    for (let item of data) {
      try {
        addNotification(item.notification)
      } catch (e) {
        console.error('receivedNotifications: invalid notification,', item)
      }
    }

    // sb.notify({type:'stop-loading', data: {selector: selector, target: 'h3'}})
  }

  var addNotification = function (item) {

    let isNew = ''
    let lastLoginCookie = sb.getCookie('lastLogin')
    if (lastLoginCookie) {
      let lastLoginDate = new Date(lastLoginCookie.slice(3, -1)) //removes the j: prefix
      let notificationDate = new Date(item.date)
      if (notificationDate - lastLoginDate > 0) isNew = '<span class="badge badge-secondary">New</span>'
    }

    let html = ['<div class="card ">',
      '<div class="card-body">',
      `<h5 class="card-title">${item.title} `,
      isNew,
      '</h5>',
      `<small class="text-muted">${sb.timeSince(item.date)}</small>`,
      `<div class="clearfix">`,
      `<img src="${item.icon}" class="rounded float-right w-25" alt="...">`,
      `<p class="card-text float-left">${item.body.trim()}</p>`,
      `</div>`,
      `<a href="${item.url}" class="card-link">...${item.url.slice(-40)}</a>`,
      '</div>',
      '</div>']

    sb.append_elements(`${selector}`, html)
  }

  return {
    init: function () {
      sb.listen({
        'notifications': receivedNotifications //todo is it necessary to make it this.buttonState???

      })
    },

    destroy: function () {

    },
  }
})
},{"../core":1}],8:[function(require,module,exports){
'use strict'

var CORE = require('../core')

CORE.create_module('settings', function (sb) {
  var selector = '#settings'

  var recievedSettings = function (data) {
    console.log('recieved settings ', data)

    try {
      let savedHooks = []
      for (let hook of data.hooks) savedHooks.push(hook.org)
      for (let org of data.orgs) addOrgToSettings(org, savedHooks)

    } catch (e) {
      console.error(e)
    }
  }

  var settingsFormSubmit = function (event) {
    event.preventDefault()
    let button = sb.findOne('#settingsFormButton')
    button.textContent = 'Updating..'
    button.disabled = true

    const inputs = event.currentTarget.querySelectorAll('input')
    let settings = {}
    for (let input of inputs) settings[input.value] = input.checked
    sb.post('settings', settings, function (error, data) {
      button.textContent = 'Save Changes'
      button.disabled = false

      if (!error && data.message) successAlert(data.message)
    })

  }

  var successAlert = function (message) {
    let html = [`<div class="alert alert-success" role="alert">`,
      `${message}`,
    `</div>`]

    sb.append_elements('#settingsForm > div:nth-child(3)', html)

  }

  var addOrgToSettings = function (org, savedHooks) {
    let subscribed = ''
    if (savedHooks.indexOf(org.login) > -1) subscribed = 'checked'

    let html = [`<div class="form-check">`,
      `<input class="form-check-input" type="checkbox" value="${org.login}" id="${org.login}" ${subscribed}>`,
      `<label class="form-check-label" for="${org.login}">${org.login} </label></div>`]

    sb.append_elements(`${selector} > div > div > div.modal-body > form > div.form-group > h6`, html)

  }
  // render the settings
  // but, should be based on current subscription settings?

  return {
    init: function () {
      sb.addEvent('#settingsForm', 'submit', settingsFormSubmit)
      sb.listen({
        'settings': recievedSettings //todo is it necessary to make it this.buttonState???

      })
    },

    destroy: function () {

    },
  }
})
},{"../core":1}],9:[function(require,module,exports){
'use strict'

var CORE = require('../core')

CORE.create_module('stats', function (sb) {
  var selector = '#stats'

  var recievedSettings = function (data) {
    console.log('recieved stats ', data)
    updateStats(data)
    //sb.notify({type: 'stop-loading', data: 'stats'})
  }

  var updateStats = function (data) {
    if (data['orgs']) createGithubStatsListItem({name: 'Organizations', length: data['orgs'].length})
    if (data['issues']) createGithubStatsListItem({name: 'Issues', length: data['issues'].length})
    if (data['teams']) createGithubStatsListItem({name: 'Teams', length: data['teams'].length})
    if (data['repos']) createGithubStatsListItem({name: 'Repositories', length: data['repos'].length})
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
},{"../core":1}],10:[function(require,module,exports){
'use strict';

var CORE = require('../core');

CORE.create_module('webPushButton', function (sb) {
    //live
     //const applicationServerPublicKey = 'BFKuHah3AIxUe0oXiWLeXJ8Yv79wmXRgHgjG2xKjymIuueQICb5E5OIUvAW033bvmfBaZi856_BhByhayfX1yFs';

    //local
    const applicationServerPublicKey = 'BIslP8UZWMbRU3RjFFaVfM5-c2jqXw1eno9TVwjt69cJPHwbbtpNYaa99E6CHJ7o4ZPPZhvR5e6fOVa5KyLwg1I';

    const pushButton = document.querySelector('#pushNoticeButton');

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
        pushButton.addEventListener('click', function () {
            pushButton.disabled = true;
            if (isSubscribed) {
                unsubscribeUser()
            } else {
                subscribeUser();
            }
        });

        // Set the initial subscription value
        swRegistration.pushManager.getSubscription()
            .then(function (subscription) {
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
            .then(function (subscription) {
                console.log('User is subscribed');

                updateSubscriptionOnServer(subscription);

                isSubscribed = true;

                updateBtn();
            })
            .catch(function (err) {
                console.log('Failed to subscribe the user: ', err);
                updateBtn();
            });
    }

    function unsubscribeUser() {
        swRegistration.pushManager.getSubscription()
            .then(subscription => {
                if (subscription) return subscription.unsubscribe();
            })
            .catch(error => {
                console.error('Error unsubscribing: ', error);
            })
            .then(() => {
                updateSubscriptionOnServer(null);

                console.log('User is unsubscribed');
                isSubscribed = false;

                updateBtn();
            })
    }

    function updateSubscriptionOnServer(subscription) {

        if (subscription) {
            sb.post('push/subscribe',subscription ,function(err, res) {console.log(err, res)});
        } else {
            sb.post('push/unsubscribe',{message:'disable subscription'}, function(err, res) {console.log(err, res)});
        }
    }


    var startWorker = function () {

        if ('serviceWorker' in navigator && 'PushManager' in window) {
            console.log('Service Worker and Push is supported');

            navigator.serviceWorker.register('public/js/sw.js')
                .then(function (swReg) {
                    console.log('Service Worker is registered', swReg);

                    swRegistration = swReg;
                    initialiseUI();
                })
                .catch(function (error) {
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
},{"../core":1}]},{},[3]);
