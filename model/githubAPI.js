'use strict';
const octonode = require('octonode');
const socketController = require('../controller/socket');

let client;
let me;
let dotenv = require('dotenv');

dotenv.load();

//TODO validation/getters/setters

function basicRequests(accessToken) {

    return new Promise((resolve, reject) => {

        if (!me) createClient(accessToken); //in case of async issues

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

function createHook(org, userID) {

    return new Promise((resolve, reject) => {

        let ghorg = client.org(org.url.org);

        ghorg.hook({
            "name": "web",
            "active": true,
            "events": ["*"], // todo load event types from client.
            "config": {
                "url": `${process.env.GITHUB_WEBHOOK_POST}/${userID}`, //todo should probably add a salt or something?
                "content_type": "json",
                "insecure_ssl": 1
            }
        }, (err, hook, body, header) => {
            if (err) {
                console.error(err);
                reject(err);
            }

            if (body && body.status !== '201 Created') { // todo same?
                console.error(body);
                reject(err);
            }

            if (hook) {
                ghorg.repos((err, repos) => {
                    if (err) {
                        reject(err);
                        console.error(err);
                    }
                    hook.login = org.url.org;

                    if (repos) {
                        hook.repos = repos;
                    }

                    resolve(hook);
                    socketController.emit('hook-created', {org: org.url.org, events: hook.events, repos: repos})
                });
            }
        });

        // todo should i just use this to list all hooks later?
        // in which case, do i even need to save to dB? I do because this doesn't contain sub info..
        ghorg.hooks(function (s, d) {
            console.log('ghorg hooks');
        });

        /**
         * {
  "type": "Organization",
  "id": 13450962,
  "name": "web",
  "active": true,
  "events": [
    "*"
  ],
  "config": {
    "content_type": "json",
    "insecure_ssl": "1",
    "url": "http://localhost:3001/webhook/callback"
  },
  "updated_at": "2017-04-26T14:16:28Z",
  "created_at": "2017-04-26T14:16:28Z",
  "url": "https://api.github.com/orgs/1DV611/hooks/13450962",
  "ping_url": "https://api.github.com/orgs/1DV611/hooks/13450962/pings"
}
         */

    });
}

function deleteHook(hookID, org) {
    // get the user
    // get the hook ID from db
    // run this
    // return confirmation

    let ghorg = client.org(org.url.org);

    ghorg.delete(hookID, (something, other, or) => {
        console.log(something);
        console.log(other, or);
    })

}


function createClient(accessToken) {
    //todo getters setters validation etc
    client = octonode.client(accessToken);
    me = client.me();
}

exports.createClient = createClient;
exports.createHook = createHook;
exports.deleteHook = deleteHook;
exports.basicRequests = basicRequests;
