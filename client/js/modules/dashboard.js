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
            var desc = $('<div class="tab-pane fade active in" id="' + orgObj.login + '-pills"> <a href="' + orgObj.url + '">' + orgObj.login + '</a> <p>' + orgObj.description + '</p></div>')
            var subButton = $('<button type="button" class="btn btn-primary subs" data-org="' + orgObj.login + '" data-hook="' + orgObj.hooks_url + '">Subscribe</button>');

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