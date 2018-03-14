'use strict';
const expect = require('chai').expect;
const notificationHelper = require('../model/helpers/notification');
const payloadHandler = require('../model/helpers/payloadHandler');
const dotenv =require('dotenv').load()


describe('util tests', () => {

    it('should pass this canary test', () => {
        expect(true).to.eql(true);
    })
});

it('should return a correctly formated notification', () => {
    let pushPayload = require('./payloads/push');
    let push = payloadHandler('push', pushPayload);

    expect(push).to.eql({
        title: "Push to testRepo by larswww",
        body: "adding a commit, will it push an event?\n'",
        icon: "https://avatars1.githubusercontent.com/u/14055501?v=4",
        url: "https://github.com/extralars/testRepo/compare/d7265ab7e1ce...2653993bf71d"
    });

    let pingPayload = require('./payloads/ping');
    let ping = payloadHandler('ping', pingPayload);

    expect(ping).to.eql({
        title: 'Subscribed to all events for extralars',
        body: 'Favor focus over features.',
        icon: 'https://avatars3.githubusercontent.com/u/27940098?v=4',
        url: 'https://api.github.com/orgs/extralars'
    })

});

it('should handle all example payloads', () => {
    const payloads = require('./data/payloadTypesAndSamples')
    const plh = require('../model/helpers/payloadHandler')

    let results = []


    for (let key in payloads) {
        results.push(plh(key, payloads[key].example))
    }

})


it('Should format the events array correctly', () => {
   let formatter = require('../model/helpers/subscribedEventsFormatter');
   let severalEvents = formatter(['push', 'commit', 'pull', 'ping']);

   expect(severalEvents).to.eql('push, commit, pull & ping');

   let allEvents = formatter(['*']);

   expect(allEvents).to.eql('all events');

   let twoEvents = formatter(['push', 'pull']);

   expect(twoEvents).to.eql('push & pull');

});

it('Should return false for invalid github user ids', () => {
    let validator = require('../controller/helpers/validateUserIDparam');
    let valid = validator('14055501');

    expect(valid).to.eql('14055501');

    let invalid = validator('1405550');

    expect(invalid).to.eql(false);

    let NotANumber = validator('14055x01');

    expect(NotANumber).to.eql(false);

    let tooLong = validator('140555019');

    expect(tooLong).to.eql(false);

});

describe('githubFacade tests', () => {
    const ghf = require('../model/githubFacade')
    const github = new ghf(process.env.github_sample_accessToken)
    console.log(process.env.github_sample_accessToken)

    it('should return results for orgs', async function () {
        const orgs = await github.apiRequest('orgs')
        console.log(orgs)


    })



});


describe('db preferences test', () => {

    it('should return an object with subscriptions and notifications', () => {



    })

});