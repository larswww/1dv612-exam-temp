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

    const data = {
      datasets: [{
        data: count
      }],

      labels: labels
    }

    const options = {
      type: 'pie',
      data: data,
    }


    sb.chart(selector, options)

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