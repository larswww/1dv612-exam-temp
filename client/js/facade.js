'use strict';

var Sandbox = {
    create: function (core, module_selector) {
        var CONTAINER = core.dom.query('#' + module_selector);
        var connectionUrl = 'http://localhost:3000'

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

            get: function (endpoint, callback) {
                core.request('GET', endpoint, callback)
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
