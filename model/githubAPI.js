'use strict';
const octonode = require('octonode');
const socketController = require('../controller/socket');

let client;
let me;
let dotenv = require('dotenv');

dotenv.load();

//TODO validation/getters/setters

function basicRequests() {

    return new Promise((resolve, reject) => {

        if (!me) me = octonode.client.me(); //in case of async issues

        let promises = [promiseAPICall('repos'), promiseAPICall('issues'), promiseAPICall('teams'), promiseAPICall('orgs')];

        Promise.all(promises).then(results => {
            let returnObj = {

            };

            results.forEach(result => {

                for (var property in result) {


                    returnObj[property] = result[property];
                }
            });
            resolve(returnObj);
        }).catch(error => {
            console.error(error);
        });
    })
}

// simple promise wrapper of API calls since octonode does not support
function promiseAPICall(apiToCall) {
    return new Promise((resolve) => {
        me[apiToCall]((err, result) => {
            if (err) {
                let returnObj = {};
                returnObj[apiToCall] = err;
                resolve(returnObj);
            }

            if (result) {
                let returnObj = {};
                returnObj[apiToCall] = result;
                resolve(returnObj);
            }
        })
    })
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

    let ghorg = octonode.client.org(org.url.org);

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
    client = octonode.client(accessToken);
    me = client.me();
}

exports.createClient = createClient;
exports.createHook = createHook;
exports.basicRequests = basicRequests;
