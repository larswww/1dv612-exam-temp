'use strict'
var CORE = require('../core')

CORE.create_module('notifications', function (sb) {
  var selector = '#notifications'

  var receivedNotifications = function (data) {
    for (let item of data) {
      try {
        addNotification(item.notification)
      } catch (e) {
        console.error('receivedNotifications: invalid notification,', item)
      }
    }

    // sb.notify({type:'stop-loading', data: {selector: selector, target: 'h3'}})
  }

  var addNotification = function (item) {

    let isNew = ''
    let lastLoginCookie = sb.getCookie('lastLogin')
    if (lastLoginCookie) {
      let lastLoginDate = new Date(lastLoginCookie.slice(3, -1)) //removes the j: prefix
      let notificationDate = new Date(item.date)
      if (notificationDate - lastLoginDate > 0) isNew = '<span class="badge badge-secondary">New</span>'
    }

    let html = ['<div class="card ">',
      '<div class="card-body">',
      `<h5 class="card-title">${item.title} `,
      isNew,
      '</h5>',
      `<small class="text-muted">${sb.timeSince(item.date)}</small>`,
      `<div class="clearfix">`,
      `<img src="${item.icon}" class="rounded float-right w-25" alt="...">`,
      `<p class="card-text float-left">${item.body.trim()}</p>`,
      `</div>`,
      `<a href="${item.url}" class="card-link">...${item.url.slice(-40)}</a>`,
      '</div>',
      '</div>']

    sb.append_elements(`${selector}`, html)
  }

  return {
    init: function () {
      sb.listen({
        'notifications': receivedNotifications //todo is it necessary to make it this.buttonState???

      })
    },

    destroy: function () {

    },
  }
})