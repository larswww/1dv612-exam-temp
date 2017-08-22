'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const schema = require('./schemas');
const formatPrefs = require('./helpers/formatPreferencesForView');

let db;

function connect(credential) {

    return new Promise((resolve, reject) => {

        let options = {
            server: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}},
            replset: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}}
        };

        mongoose.connect(credential, options);

        db = mongoose.connection;

        db.on('error', console.error.bind(console, 'connection error:'));

        db.once('open', function () {
            resolve();
            console.log('Connected to MongoLab DB');
        });


    });
}

function handleLogin(profile) {

    return new Promise((resolve, reject) => {

        schema.user.findOne({id: profile.id, username: profile.username}, function (err, matchingUser) {

            if (err) {
                reject(err);
                console.error(err);
            }

            if (matchingUser === null) { //todo this leads to wrong data going to
                let newUser = new schema.user({
                    id: profile.id,
                    username: profile.username,
                    accessToken: profile.accessToken,
                    _raw: profile._raw,
                });

                newUser.save().then(() => {
                    // todo get the array for organizations.
                });
                resolve(false); // returning/resolving false bad practice but..?
            }

            if (matchingUser) {
                getSavedPreferencesFor(matchingUser).then(prefs => {
                    resolve(prefs);
                }).catch(e => {
                    reject(e);
                });
            }
        });
    });
}

function saveSubscription(subscription, profile) {
    console.log(subscription);
    console.log(profile);

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
}

function saveNotification(subscribers, notification) {

    if (notification.organization) {

        let newNotice = new schema.notification(notification);

        newNotice.save().then(doc => {
            subscribers.forEach(sub => {
                sub.doc.update({$push: {notifications: doc._id}})
            })
        }).catch(e => {
            console.error(e);
        })
    }
}

function subscribeTo(hook, user) {

    schema.user.findOne({id: user.id}).then(userDoc => { //todo feels like an unnecessary db call?

        schema.subscription.update({user: userDoc._id},
            {
                $addToSet: {
                    hooks: hook
                }
            }
        ).catch(e => {
            console.error(e)
        });

    });

}

function unsubscribeTo(org, user) {

    return new Promise((resolve, reject) => {

        schema.user.findOne({id: user.id}).then(userDoc => {

            schema.subscription.update({user: userDoc._id, hooks: {$elemMatch: {login: org}}},
                {
                    $pull: {
                        hooks: {login: org}
                    }
                }
            ).then((error, writeResult) => {
                if (error) console.error(error);
                resolve();
                console.log(writeResult);
            });
        })
    });
}


function getSavedPreferencesFor(user) {

    return new Promise((resolve, reject) => {

        let promises = [getNotificationsFor(user), getSubscriptionsFor(user)];

        Promise.all(promises).then(values => {
            resolve(formatPrefs(values));

        }).catch(e => {
            reject(e);
        });

        // return notifications and subscriptions.

    });
}

function getSubscriptionsFor(user) {

    return new Promise((resolve, reject) => {

        schema.subscription.findOne({user: user._id}).then(subDoc => {

            if (subDoc) {
                resolve(subDoc)

            } else {
                let newSub = new schema.subscription({user: user._id});
                newSub.save();
                resolve(false);
            }
        });
    })
}

function getNotificationsFor(user) {

    return new Promise((resolve, reject) => {
        resolve(true);

    })
}


function getUser(userID) {

    return new Promise(function (resolve, reject) {

        schema.user.findOne({id: userID}).then(user => {
            if (user) {
                resolve(user)
            } else {
                reject(false);
            }
        })
    })
}


exports.connect = connect;
exports.handleLogin = handleLogin;
exports.saveSubscription = saveSubscription;
exports.saveOrganizations = saveOrganizations;
exports.findSubscribers = findSubscribers;
exports.saveNotification = saveNotification;
exports.subscribe = subscribeTo;
exports.unsubscribe = unsubscribeTo;
exports.getUser = getUser;
exports.getSavedPreferencesFor = getSavedPreferencesFor;