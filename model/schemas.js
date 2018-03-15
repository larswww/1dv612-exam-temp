'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const findOrCreate = require('mongoose-findorcreate');
//
// let hookSchema = new mongoose.Schema({
//     org: String,
//     id: Number,
//     events: Array
// });
//
// let hook = mongoose.model('hook', hookSchema);
//
// let subscriptionSchema = new mongoose.Schema({
//     user: {
//         type: Schema.Types.ObjectId,
//         ref: 'user',
//         required: [true, 'A subscription needs a user']
//     },
//     hooks: Array
//
// });
//
// subscriptionSchema.plugin(findOrCreate);
//
// let subscription = mongoose.model('subscription', subscriptionSchema);

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

    subscription: {
      type: String
    },

    _raw: {
        type: String
    },

    hooks: Array


});

// userSchema.post('save', doc => {
//     let sub = new subscription({user: doc._id });
//     sub.save();
// });

userSchema.statics.lastLogin = (id) => {
    this.findByIdAndUpdate(id, {$set: {'lastLogin': Date.now()}});
};

let user = mongoose.model('user', userSchema);



let notificationSchema = new mongoose.Schema({

    user: Schema.Types.ObjectId,
    event: String,
    forUser: String,
    notification: Object,
    date: { type: Date, default: Date.now }

});

let notification = mongoose.model('notification', notificationSchema);

exports.user = user;
exports.notification = notification;
// exports.subscription = subscription;