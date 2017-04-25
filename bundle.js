(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var Sandbox = require('./sandbox');

module.exports = (function () {
    var moduleData = {};
    var debug = true;

    return {
        debug: function (on) {
            debug = on ? true : false;
          },

        create_module: function (moduleID, creator) {
            var temp;
            if (typeof moduleID === 'string' && typeof creator === 'function') {
              temp = creator(Sandbox.create(this, moduleID));
              if (temp.init && temp.destroy && typeof temp.init === 'function' && typeof temp.destroy === 'function') {
                moduleData[moduleID] = {
                    create: creator,
                    instance: null,
                  };
                temp = null;
              } else {
                this.log(1, 'Module "' + moduleId + '" Registration: FAILED: instance has no init or destroy functions');
              }
            } else {
              this.log(1, 'Module "' + moduleId + '" Registration: FAILED: one or more arguments are of incorrect type');

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
            if (data = moduleData[moduleId] && data.instance) {
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

      };

  }());

},{"./sandbox":4}],2:[function(require,module,exports){
var core = require('./core');
var sandbox = require('./sandbox');
var testModule = require('./model/testModule');


},{"./core":1,"./modules/testModule":3,"./sandbox":4}],3:[function(require,module,exports){
'use strict';
var core = require('../core');

core.create_module('product-panel', function (sb) {
    var products;

    function eachProduct(fn) {
      var i = 0, product;
      for (; product = products[i++];) {
        fn(product);
      }
    }

    function reset() {
      eachProduct(function (product) {
          product.style.opacity = '1';
        });
    }

    return {
        init: function () {
            var that = this;
            products = sb.find('li');
            sb.listen({
                'change-filter': this.change_filter,
                'reset-fitlers': this.reset,
                'perform-search': this.search,
                'quit-search': this.reset
            });
            eachProduct(function (product) {
                sb.addEvent(product, 'click', that.addToCart);
            });
        },

        reset: reset,

        destroy: function () {
            var that = this;
            eachProduct(function (product) {
                sb.removeEvent(product, 'click', that.addToCart);
            });
            sb.ignore(['change-filter', 'reset-filters', 'perform-search', 'quit-search']);
        },

        search: function (query) {
            reset();
            query = query.toLowerCase();
            eachProduct(function (product) {
                if (product.getElementsByTagName('p')[0].innerHTML.toLowerCase().indexOf(query) < 0) {
                    product.style.opacity = '0.2';
                }
            });
        },
        change_filter: function (filter) {
            reset();
            eachProduct(function (product) {
                if (product.getAttribute('data-8088-keyword').toLowerCase().indexOf(filter.toLowerCase()) < 0) {
                    product.style.opacity = '0.2';
                }
            });
        },

        addToCart: function (e) {
            var li = e.currentTarget;
            sb.notify({
                type: 'add-item',
                data: {id: li.id, name: li.getElementsByTagName('p')[0].innerHTML, price: parseInt(li.id, 10)}
            });

        }
    }
  });

},{"../core":1}],4:[function(require,module,exports){
'use strict';

module.exports = {
        create: function (core, module_selector) {
            var CONTAINER = core.dom.query('#' + module_selector);
            return {};
          },

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

      }
    ;

},{}]},{},[2]);
