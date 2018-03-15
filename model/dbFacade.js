'use strict';
const mongoose = require('mongoose')
const schema = require('./schemas')


class DatabaseFacade {

    getHooks(user) {


    }

    async getUserById(userid) {
        return await schema.user.findOne({_id: userid})
    }

    async saveHook(userid, org, hook) {

        try {
            let user = await this.getUserById(userid)
            user.hooks.push({org: org, hook: hook})
            return await user.save()
        } catch (e) {
            console.error(JSON.stringify(e))
        }

    }

    async removeHook(userid, org) {
        try {
            let user = await schema.user.findOne({_id: userid}, {hooks: {$elemMatch: {org: org}}}, {"hooks.$": 1})
            let removeResult = await schema.user.update({_id: userid}, {$pull: {hooks: {org: org}}})
            if (removeResult.nModified === 0) return false
            return user.hooks[0].hook

        } catch (e) {
            console.error(e)
            return []
        }
    }

    async hookExists(userid, org) {
        let user = await schema.user.findOne({_id: userid}, {hooks: {$elemMatch: {org: org}}}, {"hooks.$": 1})
        return user.hooks.length === 0;
    }

    async getGooks(userId) {
        let user = await this.getUserById(userId)
        return user.hooks
    }

    async getNotificationsFor(userid) {

        try {
            let notifications = await schema.notification.find({user: userid}).sort('date')
            return notifications
        } catch (e) {
            console.error(e)
            return []
        }

    }


}


module.exports = new DatabaseFacade()