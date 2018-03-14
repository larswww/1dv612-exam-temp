'use strict';

var CORE = require('../core');

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



        const inputs = event.currentTarget.querySelectorAll('input')
        let settings = {}
        for (let input of inputs) settings[input.value] = input.checked
        sb.post('settings', settings, function (err, data) {
            if (err) console.error(err)


        })

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
            sb.notify({type: 'start-loading', data: {selector: selector, target: 'h3'}})
            sb.listen({
                'settings': recievedSettings //todo is it necessary to make it this.buttonState???

            })
        },


        destroy: function () {

        },
    }
})