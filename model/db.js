'use strict';
const mongoose = require('mongoose');
const schema = require('./schemas');
let db;

function connect(credential) {

    let options = {
        server: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}},
        replset: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}}
    };

    mongoose.connect(credential, options);

    db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', function () {
        console.log('Connected to MongoLab DB');
    });

}

function handleLogin(profile) {

    schema.user.findOne({ id: profile.id, username: profile.username}, function (err, matchingUser) {

        if (err) {
            console.error(err);
        }

        if (matchingUser === null) {
            let newUser = new schema.user({
                id: profile.id,
                username: profile.username,
                accessToken: profile.accessToken,
                _raw: profile._raw,
            });

            newUser.save()
        }

        if (matchingUser) {
            console.log('user exists in db')
        }

    });
}

function saveSubscription(subscription, profile) {

    let json = JSON.stringify(subscription);

    schema.user.findOneAndUpdate({ id: profile.id, username: profile.username }, {subscription: json}, function (err, matchingUser) {

        if (err) {
            console.error(err);
        }

        if (matchingUser === null) {
            console.error('Couldnt find user to save subscription to');
        }

        if (matchingUser) {
            matchingUser.subscription = subscription;
            matchingUser.save();
        }

    })
}

/**

 { id: '14055501',
  displayName: null,
  username: 'larswww',
  profileUrl: 'https://github.com/larswww',
  provider: 'github',
  _raw: '{"login":"larswww","id":14055501,"avatar_url":"https://avatars2.githubusercontent.com/u/14055501?v=3","gravatar_id":"","url":"https://api.github.com/users/larswww","html_url":"https://github.com/larswww","followers_url":"https://api.github.com/users/larswww/followers","following_url":"https://api.github.com/users/larswww/following{/other_user}","gists_url":"https://api.github.com/users/larswww/gists{/gist_id}","starred_url":"https://api.github.com/users/larswww/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/larswww/subscriptions","organizations_url":"https://api.github.com/users/larswww/orgs","repos_url":"https://api.github.com/users/larswww/repos","events_url":"https://api.github.com/users/larswww/events{/privacy}","received_events_url":"https://api.github.com/users/larswww/received_events","type":"User","site_admin":false,"name":null,"company":null,"blog":null,"location":null,"email":null,"hireable":null,"bio":null,"public_repos":20,"public_gists":0,"followers":0,"following":4,"created_at":"2015-08-31T13:27:10Z","updated_at":"2017-04-16T05:59:57Z","private_gists":0,"total_private_repos":1,"owned_private_repos":1,"disk_usage":35724,"collaborators":0,"two_factor_authentication":false,"plan":{"name":"developer","space":976562499,"collaborators":0,"private_repos":9999}}',
  _json:
   { login: 'larswww',
     id: 14055501,
     avatar_url: 'https://avatars2.githubusercontent.com/u/14055501?v=3',
     gravatar_id: '',
     url: 'https://api.github.com/users/larswww',
     html_url: 'https://github.com/larswww',
     followers_url: 'https://api.github.com/users/larswww/followers',
     following_url: 'https://api.github.com/users/larswww/following{/other_user}',
     gists_url: 'https://api.github.com/users/larswww/gists{/gist_id}',
     starred_url: 'https://api.github.com/users/larswww/starred{/owner}{/repo}',
     subscriptions_url: 'https://api.github.com/users/larswww/subscriptions',
     organizations_url: 'https://api.github.com/users/larswww/orgs',
     repos_url: 'https://api.github.com/users/larswww/repos',
     events_url: 'https://api.github.com/users/larswww/events{/privacy}',
     received_events_url: 'https://api.github.com/users/larswww/received_events',
     type: 'User',
     site_admin: false,
     name: null,
     company: null,
     blog: null,
     location: null,
     email: null,
     hireable: null,
     bio: null,
     public_repos: 20,
     public_gists: 0,
     followers: 0,
     following: 4,
     created_at: '2015-08-31T13:27:10Z',
     updated_at: '2017-04-16T05:59:57Z',
     private_gists: 0,
     total_private_repos: 1,
     owned_private_repos: 1,
     disk_usage: 35724,
     collaborators: 0,
     two_factor_authentication: false,
     plan:
      { name: 'developer',
        space: 976562499,
        collaborators: 0,
        private_repos: 9999 } },
  accessToken: '6989b72b7270618b4100135ca70bcc44c3c9aab3',
  refreshToken: undefined }
 undefined
 null 200 { login: 'larswww',
  id: 14055501,
  avatar_url: 'https://avatars2.githubusercontent.com/u/14055501?v=3',
  gravatar_id: '',
  url: 'https://api.github.com/users/larswww',
  html_url: 'https://github.com/larswww',
  followers_url: 'https://api.github.com/users/larswww/followers',
  following_url: 'https://api.github.com/users/larswww/following{/other_user}',
  gists_url: 'https://api.github.com/users/larswww/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/larswww/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/larswww/subscriptions',
  organizations_url: 'https://api.github.com/users/larswww/orgs',
  repos_url: 'https://api.github.com/users/larswww/repos',
  events_url: 'https://api.github.com/users/larswww/events{/privacy}',
  received_events_url: 'https://api.github.com/users/larswww/received_events',
  type: 'User',
  site_admin: false,
  name: null,
  company: null,
  blog: null,
  location: null,
  email: null,
  hireable: null,
  bio: null,
  public_repos: 20,
  public_gists: 0,
  followers: 0,
  following: 4,
  created_at: '2015-08-31T13:27:10Z',
  updated_at: '2017-04-16T05:59:57Z',
  private_gists: 0,
  total_private_repos: 1,
  owned_private_repos: 1,
  disk_usage: 35724,
  collaborators: 0,
  two_factor_authentication: false,
  plan:
   { name: 'developer',
     space: 976562499,
     collaborators: 0,
     private_repos: 9999 } } { server: 'GitHub.com',
  date: 'Sun, 23 Apr 2017 10:41:34 GMT',
  'content-type': 'application/json; charset=utf-8',
  'content-length': '1315',
  connection: 'close',
  status: '200 OK',
  'x-ratelimit-limit': '5000',
  'x-ratelimit-remaining': '4989',
  'x-ratelimit-reset': '1492945778',
  'cache-control': 'private, max-age=60, s-maxage=60',
  vary: 'Accept, Authorization, Cookie, X-GitHub-OTP, Accept-Encoding',
  etag: '"65705c5fb3626df101280a16bc61373e"',
  'last-modified': 'Sun, 16 Apr 2017 05:59:57 GMT',
  'x-oauth-scopes': 'admin:org_hook, admin:repo_hook, notifications, user',
  'x-accepted-oauth-scopes': '',
  'x-oauth-client-id': 'a82d874c29886d62d162',
  'x-github-media-type': 'github.v3; format=json',
  'access-control-expose-headers': 'ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
  'access-control-allow-origin': '*',
  'content-security-policy': 'default-src \'none\'',
  'strict-transport-security': 'max-age=31536000; includeSubdomains; preload',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'deny',
  'x-xss-protection': '1; mode=block',
  'x-served-by': '77fbfb53269bbb85f82f23584d59f7c1',
  'x-github-request-id': 'EBCC:27522:2A99131:36D6468:58FC84DD' }

 **/



exports.connect = connect;
exports.handleLogin = handleLogin;
exports.saveSubscription = saveSubscription;