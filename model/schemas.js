'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');

let hookSchema = new mongoose.Schema({
    org: String,
    id: Number,
    events: Array
});

let hook = mongoose.model('hook', hookSchema);

let subscriptionSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'A subscription needs a user']
    },
    hooks: Array

});

subscriptionSchema.plugin(findOrCreate);

let subscription = mongoose.model('subscription', subscriptionSchema);

let userSchema = new mongoose.Schema({

    id: {
        type: String,
        required: true,
        unique: true,
    },

    username: {
        type: String,
        required: true,
        unique: true,
    },

    accessToken: {
        type: String,
        required: true,
        unique: true
    },

    _raw: {
        type: String
    },

    organizations: {
        type: Array
    },

    notifications: [{ type: Schema.Types.ObjectId, ref: 'notification' }]

});

userSchema.post('save', doc => {
    let sub = new subscription({user: doc._id });
    sub.save();
});

let user = mongoose.model('user', userSchema);



let notificationSchema = new mongoose.Schema({

    event: {
        type: String,
        required: true,
    },

    sender: {
        type: String,
    },

    organization: {
        type: String,
    },

    repository: {
        type: String,
    },

    date: { type: Date, default: Date.now }

});

let notification = mongoose.model('notification', notificationSchema);



exports.user = user;
exports.notification = notification;
exports.subscription = subscription;