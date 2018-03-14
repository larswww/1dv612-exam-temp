'use strict';
const octonode = require('octonode');


class GithubApi {

    constructor(accessToken) {
        this.client = octonode.client(accessToken);
        this.me = this.client.me();
    }

    async apiRequest(endpoint) {
        let me = this.me

        return new Promise((resolve, reject) => {
            me[endpoint]((err, result) => {
                if (err) {
                    reject({error: err})
                }

                if (result) {
                    resolve(result);
                }
            })
        })

    }

    async createHook(org, userID) {
        let ghorg = this.client.org(org)

        return new Promise(function (resolve, reject) {
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
                    console.log(hook)
                    resolve(hook)
                }
            });

            // todo should i just use this to list all hooks later?
            // in which case, do i even need to save to dB? I do because this doesn't contain sub info..
            ghorg.hooks(function (s, d) {
                console.log('ghorg hooks');
            });

        })

    }


}

module.exports = GithubApi