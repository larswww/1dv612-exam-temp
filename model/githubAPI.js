'use strict';
const octonode = require('octonode');
const socketController = require('../controller/socket');

let github = {};
let dotenv = require('dotenv');

dotenv.load();

//TODO validation/getters/setters

function basicGithubRequests() {

    if (!github.client) return;

    let me = github.client.me();

    me.info(function (err, user) {
    });

    me.orgs(function (err, orgs) {

        socketController.emit('github-organisations', {data: orgs});

        // sendReposForEachOrganisation(github.client, github.socket, orgs);

    });

    me.repos(function (err, repos) {


        repos.forEach(repo => {
        })
    });

    me.issues({}, function (err, issues) {
    });

    me.teams({}, function (err, teams) {
    });
}


let sendReposForEachOrganisation = function (client, socket, orgs) {

    let sendRepos = function (err, repos) {
        if (err) console.error(err);

        if (repos) socketController.emit('org-repos', {data: repos});
        //socket.emit('org-repos', {data: repos})
    };

    orgs.forEach(org => {
        let ghorg = client.org(org.login);
        ghorg.repos(sendRepos);
    });
};

function createHook(org) {

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
    }, function (err, hook, body, header) {
        if (err) console.error(err);

        if (body && body.status !== '201 Created') {
            console.error(body);
        }

        if (hook) {
            socketController.emit('hook-created', {org: org.url.org, events: hook.events})
        }
    });

    ghorg.hooks(function (s, d) {
    })

}

function createClient(accessToken) {
    //todo getters setters validation etc
    github.client = octonode.client(accessToken);
}

exports.createClient = createClient;
exports.createHook = createHook;
exports.basicRequests = basicGithubRequests;
