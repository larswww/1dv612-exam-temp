'use strict'

var CORE = require('../core')

CORE.create_module('charts', function (sb) {
  var selector = '#stats'

  var notificationsChart = function (event) {
    let eventCount = {}

    for (let noticeObj of event) {
      if (!eventCount[noticeObj.event]) eventCount[noticeObj.event] = 0
      eventCount[noticeObj.event] += 1
    }

    let labels = []
    let count = []

    for (let label in eventCount) {
      labels.push(label)
      count.push(eventCount[label])
    }

    let colors = []
    for (let i of labels) {
      colors.push(dynamicColors())
    }

    const data = {
      labels: labels,
      datasets: [{
        label: 'Event Types in your Organizations',
        data: count,
        backgroundColor: colors
      }]
    }

    const options = {
      type: 'pie',
      data: data,
    }


    sb.chart(selector, options)

  }

  //https://jsfiddle.net/5kLbasqp/26/
  var dynamicColors = function() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  // once done pass each data obj into chart gen
  return {
    init: function () {
      sb.listen({
        'notifications': notificationsChart,
      })
    },

    destroy: function () {

    },
  }
})