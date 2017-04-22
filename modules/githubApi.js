'use strict';
const octonode = require('octonode');
const auth0IdpToken = require('./auth0IdpToken');
const github = new GithubClient();


// let gitApi = require('octonode-api');
// let jwt = require('jsonwebtoken');
// let octonode = require('octonode');

function testGithub(io) {

    // let ghme = github.client.me();
    // let ghuser = client.user('larswww');
    // let ghrepo = client.repo('larswww/2dv513a3');
    // let ghorg = client.org('1dv527');


    io.on('connection', function (socket) {

        socket.on('authenticated', profile => {

            github.profile = profile;
            github.createClient(profile.user_id).then(client => {
                basicGithubRequests(client, socket);
                github.client = client;
            })

        });

        socket.on('create-hook', org => {

            console.log(org.url.org);

            let ghorg = github.client.org(org.url.org);

            ghorg.repos(function (err, repos) {
            });

            ghorg.hook({
                "name": "web",
                "active": true,
                "events": ["push", "pull_request"],
                "config": {
                    "url": "http://requestb.in/1ddydc81",
                    "content_type": "json",
                    "insecure_ssl": 1
                }
            }, function (err, s, b, h) {
                console.log(err, s, b, h)
            });

            ghorg.hooks(function (s, d) {
            })
        });

        let basicGithubRequests = function (client) {

            let me = client.me();

            client.get('/user', {}, function (err, status, body, headers) {
                console.log(err, status, body, headers);
                if (body) socket.emit('github-profile', body);
            });

            me.info(function (err, user) {
                console.log(user);
            });

            me.orgs(function (err, orgs) {

                socket.emit('github-organisations', { data: orgs });

                sendReposForEachOrganisation(client, socket, orgs);
                console.log(orgs);

            });

            me.repos(function (err, repos) {

                console.log(repos);

                repos.forEach(repo => {
                    console.log(repo.owner.login);
                })
            });

            me.issues({}, function (err, issues) {
                console.log(issues)
            });

            me.teams({}, function (err, teams) {
                console.log(teams);
            });
        };


        //
        //
        // ghme.orgs(function (err, arrayOfOrgs) {
        //     socket.emit('github-organisations', {data: arrayOfOrgs});
        //     // console.log(arrayOfOrgs);

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
        // });

        // ghuser.events(function (err, data) {
        //     // console.log('gh event data');
        //     // console.log(data);
        //
        //     socket.emit('octonode-events', {events: data})
        // });

        // });
        //
        // let consoleLogCb = function (err, res) {
        //     console.error(err);
        //     console.log(res);
        // };
        //
        // ghme.repos(function (err, arrayOfRepos) {
        //     // console.log(arrayOfRepos);
        // });
        //
        // // since	string	Only show notifications updated after the given time. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ. Default: Time.now
        // // before	string	Only show notifications updated before the given time. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.
        // ghme.notifications({all: true, before: new Date()}, function (err, notifications) {
        //     // console.log('notifications', err, notifications);
        // });
        // //
        // // ghme.issues({}, consoleLogCb);
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
    });
};

//TODO validation/getters/setters
function GithubClient() {

}


let sendReposForEachOrganisation = function (client, socket, orgs) {

    let sendRepos = function (err, repos) {
        if (err) console.error(err);

        if (repos) socket.emit('org-repos', { data: repos })
    };

    orgs.forEach(org => {
        let ghorg = client.org(org.login);
        ghorg.repos(sendRepos);
    });



};

GithubClient.prototype.createClient = function (user_id) {

    return new Promise(function (resolve, reject) {

        auth0IdpToken(user_id).then(function (token) {
            let client = octonode.client(token);
            //todo check health of client and reject()?
            resolve(client);
        });

    });


};

module.exports = testGithub;
