'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
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

    schema.user.findOne({id: profile.id, username: profile.username}, function (err, matchingUser) {

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

    schema.user.findOneAndUpdate({
        id: profile.id,
        username: profile.username
    }, {subscription: json}, function (err, matchingUser) {

        //TODO could make this DRY
        if (err) {
            console.error(err);
        }

        if (matchingUser === null) {
            console.error('Couldnt find user to save subscription to');
        }

        if (matchingUser) {
            console.log('matched a user and go');
            // matchingUser.subscription = subscription;
            // matchingUser.save();
        }

    })
}

function saveOrganizations(orgs, profile) {

    console.log(orgs);

    schema.user.findOneAndUpdate({
        id: profile.id,
        username: profile.username
    }, {organizations: orgs.data}, function (err, matchingUser) {

        //TODO could make this DRY
        if (err) {
            console.error(err);
        }

        if (matchingUser === null) {
            console.error('couldnt find user to save orgs to');
        }

        if (matchingUser) {
            console.log('matched user saved orgs');
        }
    })
}

function findSubscribers(event) {

    return new Promise(function (resolve, reject) {

        if (event.organization) {

            schema.user.find({'organizations.id': event.organization}, function (err, matchingUsers) {

                if (err) console.error(err);

                if (matchingUsers) {
                    let subscribers = [];
                    matchingUsers.forEach(user => {

                        if (user.subscription) {
                            let subscriber = {};
                            subscriber.id = user.id;
                            subscriber.username = user.username;
                            subscriber.subscription = user.subscription;
                            subscriber.doc = user;
                            subscribers.push(subscriber);
                        }
                    });
                    resolve(subscribers)
                }
            });

        }

    });

    // for repo
}

function saveNotification(subscribers, notification) {

    if (notification.organization) {

        let newNotice = new schema.notification(notification);

        newNotice.save().then(doc => {
            subscribers.forEach(sub => {
                sub.doc.update({ $push: { notifications: doc._id }})
            })
        }).catch(e => {
            console.error(e);
        })
    }
}

function userNotifications(user) {

}

function subscribeTo(org, user) {

}


exports.connect = connect;
exports.handleLogin = handleLogin;
exports.saveSubscription = saveSubscription;
exports.saveOrganizations = saveOrganizations;
exports.findSubscribers = findSubscribers;
exports.saveNotification = saveNotification;
exports.userNotifications = userNotifications;
exports.subscribe = subscribeTo;