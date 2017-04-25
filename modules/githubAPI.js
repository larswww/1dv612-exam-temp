'use strict';
const octonode = require('octonode');
const webpush = require('./webPush');

let github = {};
let dotenv = require('dotenv');

dotenv.load();

function githubSocketsController(socket) {

        github.socket = socket;

        socket.on('create-hook', org => {

            let ghorg = github.client.org(org.url.org);

            ghorg.repos(function (err, repos) {
            });

            ghorg.hook({
                "name": "web",
                "active": true,
                "events": ["*"],
                "config": {
                    "url": process.env.GITHUB_WEBHOOK_POST,
                    "content_type": "json",
                    "insecure_ssl": 1
                }
            }, function (err, s, b, h) {
            });

            ghorg.hooks(function (s, d) {
            })
        });

        socket.on('base-req', data => {
            basicGithubRequests();
        });

        socket.on('push-subscription', data => {
            //todo save the subscription in db.
           webpush.subscribe(data);
        });
}

//TODO validation/getters/setters

let basicGithubRequests = function () {

    if (!github.client) return;

    let me = github.client.me();

    github.client.get('/user', {}, function (err, status, body, headers) {
        if (body) github.socket.emit('github-profile', body);
    });

    me.info(function (err, user) {
    });

    me.orgs(function (err, orgs) {

       github.socket.emit('github-organisations', {data: orgs});

        sendReposForEachOrganisation(github.client, github.socket, orgs);

    });

    me.repos(function (err, repos) {


        repos.forEach(repo => {
        })
    });

    me.issues({}, function (err, issues) {
    });

    me.teams({}, function (err, teams) {
    });
};


let sendReposForEachOrganisation = function (client, socket, orgs) {

    let sendRepos = function (err, repos) {
        if (err) console.error(err);

        if (repos) socket.emit('org-repos', {data: repos})
    };

    orgs.forEach(org => {
        let ghorg = client.org(org.login);
        ghorg.repos(sendRepos);
    });
};

function createClient(accessToken) {
    //todo getters setters validation etc
    github.client = octonode.client(accessToken);
}

function activateSockets(socket) {
    github.socket = socket;
    githubSocketsController(github.socket);
}

module.exports = {
    createClient: createClient,
    activateSockets: activateSockets
};
