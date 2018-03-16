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