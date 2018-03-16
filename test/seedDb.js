'use strict'
const dbFacade = require('../model/dbFacade')
const samples = require('../test/data/payloadTypesAndSamples')
const createNotification = require('../model/helpers/notification')

module.exports = async function () {
  const lars = await dbFacade.getUserByGithubId('14055501')

  if (lars) {
    const notifications = await dbFacade.getNotificationsFor(lars._id)
    if (notifications.length < 5) {
      for (let key in samples) {
        let newNotice = createNotification.format('14055501', key, samples[key].example)
        await dbFacade.saveNotification(lars, newNotice)
      }
    }
  }

}