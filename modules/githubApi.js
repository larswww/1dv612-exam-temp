'use strict';
let github = require('octonode');
// let gitApi = require('github-api');
// let jwt = require('jsonwebtoken');
// let github = require('github');

let token = 'bee5e4be7664b86c496d46884c4ffa53bb312777';


function testGithub(io) {

    let client = github.client(token);
    let ghme = client.me();
    let ghuser = client.user('larswww');
    let ghrepo = client.repo('larswww/2dv513a3');


    io.on('connection', function (socket) {

        socket.on('create-hook', function (data) {
            let ghorg = client.org(data.org);

            console.log(data.org);

            ghorg.hook({
                "name": "web",
                "active": true,
                "events": ['push', 'pull_request', 'fork', 'gollum', 'issue_comment', 'issues', 'label', 'organization', 'project', 'release', 'repository'],
                "config": {
                    "url": 'http://requestb.in/1nktvf71'
                }
            }, function (hook) {
                console.log(hook)
            })

        });

        client.get('/user', {}, function (err, status, body, headers) {
            socket.emit('github', body);
            //json object
            // socket.emit('github', body)
        });


        ghme.orgs(function (err, arrayOfOrgs) {
            socket.emit('github-organisations', {data: arrayOfOrgs});
            // console.log(arrayOfOrgs);

            // console.log(arrayOfOrgs);
            // [ { login: '1dv612',
            //     id: 23627019,
            //     url: 'https://api.github.com/orgs/1dv612',
            //     repos_url: 'https://api.github.com/orgs/1dv612/repos',
            //     events_url: 'https://api.github.com/orgs/1dv612/events',
            //     hooks_url: 'https://api.github.com/orgs/1dv612/hooks',
            //     issues_url: 'https://api.github.com/orgs/1dv612/issues',
            //     members_url: 'https://api.github.com/orgs/1dv612/members{/member}',
            //     public_members_url: 'https://api.github.com/orgs/1dv612/public_members{/member}',
            //     avatar_url: 'https://avatars1.githubusercontent.com/u/23627019?v=3',
            //     description: '' } ]

            // console.log('organisations', err, arrayOfOrgs)
        });

        ghuser.events(function (err, data) {
            // console.log('gh event data');
            // console.log(data);

            socket.emit('github-events', {events: data})
        });

    });


    let consoleLogCb = function (err, res) {
        console.error(err);
        console.log(res);
    };


    ghme.repos(function (err, arrayOfRepos) {
        // console.log(arrayOfRepos);
    });


    // since	string	Only show notifications updated after the given time. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ. Default: Time.now
    // before	string	Only show notifications updated before the given time. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.
    ghme.notifications({all: true, before: new Date()}, function (err, notifications) {
        // console.log('notifications', err, notifications);
    });
    //
    // ghme.issues({}, consoleLogCb);
    //
    // ghme.teams({}, consoleLogCb);
    //
    // ghme.starred(consoleLogCb);


    // ghrepo.commits(consoleLogCb)

    //ghrepo.hooks(consoleLogCb);

    // { type: 'Repository',
    //     id: 12567492,
    //     name: 'web',
    //     active: true,
    //     events: [ 'pull_request', 'push' ],
    //     config:
    //     { url: 'http://requestb.in/1n84v2b1',
    //         insecure_ssl: '0',
    //         content_type: 'form' },
    //     updated_at: '2017-03-10T16:21:41Z',
    //         created_at: '2017-03-10T16:21:41Z',
    //     url: 'https://api.github.com/repos/larswww/2dv513a3/hooks/12567492',
    //     test_url: 'https://api.github.com/repos/larswww/2dv513a3/hooks/12567492/test',
    //     ping_url: 'https://api.github.com/repos/larswww/2dv513a3/hooks/12567492/pings',
    //     last_response: { code: 200, status: 'active', message: 'OK' } } ]


    // ghrepo.hook({
    //     "name": "web",
    //     "active": true,
    //     "events": ["push", "pull_request"],
    //     "config": {
    //         "url": "http://requestb.in/1n84v2b1"
    //     }
    // }, consoleLogCb); // hook


}

module.exports = testGithub;
