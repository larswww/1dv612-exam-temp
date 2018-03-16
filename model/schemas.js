'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    type: String,
    default: 'false'
  },

  _raw: {
    type: String
  },

  hooks: Array,

  lastLogin: {
    type: Date,
    default: Date.now()
  }

})

let user = mongoose.model('user', userSchema)

let notificationSchema = new mongoose.Schema({
  user: Schema.Types.ObjectId,
  event: String,
  forUser: String,
  notification: Object,
  org: String,
  date: {type: Date, default: Date.now}
})

let notification = mongoose.model('notification', notificationSchema)

exports.user = user
exports.notification = notification