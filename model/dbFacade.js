'use strict'
const schema = require('./schemas')

class DatabaseFacade {

  async getUserById (userid) {
    return await schema.user.findOne({_id: userid})
  }

  async handleLogin (profile) {

    return new Promise((resolve, reject) => {

      schema.user.findOne({id: profile.id, username: profile.username}, function (err, matchingUser) {

        if (err) {
          reject(err)
          console.error(err)
        }
        // automatically create if users doesnt exist
        if (matchingUser === null) {
          let newUser = new schema.user({
            id: profile.id,
            username: profile.username,
            accessToken: profile.accessToken,
            _raw: profile._raw,
          })

          newUser.save().then(() => {
            resolve(newUser)
          })
        }

        if (matchingUser) {
          matchingUser.accessToken = profile.accessToken
          resolve(matchingUser)
          matchingUser.save()
        }
      })
    })
  }

  async getUserByGithubId (githubid) {
    return await schema.user.findOne({id: githubid})
  }

  async updateLastLogin (user) {
    user.lastLogin = Date.now()
    await user.save()
  }

  async saveHook (userid, org, hook) {

    try {
      let user = await this.getUserById(userid)
      user.hooks.push({org: org, hook: hook})
      return await user.save()
    } catch (e) {
      console.error('saveHook', JSON.stringify(e))
    }
  }

  async removeHook (userid, org) {
    try {
      let user = await schema.user.findOne({_id: userid}, {hooks: {$elemMatch: {org: org}}}, {'hooks.$': 1})
      let removeResult = await schema.user.update({_id: userid}, {$pull: {hooks: {org: org}}})
      if (removeResult.nModified === 0) return false
      return user.hooks[0].hook

    } catch (e) {
      console.error('removeHook', e)
      return []
    }
  }

  async hookExists (userid, org) {
    let user = await schema.user.findOne({_id: userid}, {hooks: {$elemMatch: {org: org}}}, {'hooks.$': 1})
    return user.hooks.length === 0
  }

  async getGooks (userId) {
    let user = await this.getUserById(userId)
    return user.hooks
  }

  async getNotificationsFor (userid) {

    try {
      let notifications = await schema.notification.find({user: userid}).sort('-date')
      return notifications
    } catch (e) {
      console.error('getNotificationsFor', e)
      return []
    }

  }

  async saveNotification (user, notification) {
    try {
      notification.user = user._id
      let newNotice = new schema.notification(notification)
      await newNotice.save()
    } catch (e) {
      console.error('saveNotification', e)
    }

  }

  async saveSubscription (subscription, profile) {

    try {
      const updated = schema.user.findOneAndUpdate({id: profile.id, username: profile.username},
        {subscription: JSON.stringify(subscription)})

      if (!updated) console.log('no user to save subscription for')
      if (updated) console.log('subscription saved')

    } catch (e) {
      console.error(`saveSubscription: `, JSON.stringify(e))
    }
  }

  async deleteSubscription (githubUserId) {

    try {
      schema.user.findOneAndUpdate({id: githubUserId.id, username: githubUserId.username},
        {subscription: false})
    } catch (e) {
      console.error('deleteSubscription', e)
    }
  }

}

module.exports = new DatabaseFacade()