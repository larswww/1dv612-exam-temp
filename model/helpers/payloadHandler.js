'use strict';
const subscribedEventsFormatter = require('./subscribedEventsFormatter');
const moment = require('moment')


module.exports = function (event, payload) {

    try {
        let notification = formatNotification[event](payload)
        notification.key = event
        notification.date = moment()
        return notification
    } catch (error) {
        console.error(`payloadHandler.js error for: ${event} and payload:`, JSON.stringify(payload))
    }

};

let formatNotification = {

    commit_comment: payload => {
        return {
            title: `Commit comment by ${payload.comment.user.login}`,
            body: `${payload.comment.body}`,
            icon: `${payload.comment.user.avatar_url}`,
            url: payload.comment.url
        }
    },

    create: (payload) => {
        return {
            title: `A new ${payload.ref_type} was created`,
            body: `For ${payload.repository.name}`,
            icon: payload.sender.avatar_url,
            url: payload.repository.html_url
        }
    },

    delete: (payload) => {
        return {
            title: `A ${payload.ref_type} was deleted:`,
            body: `${payload.ref}`,
            icon: payload.sender.avatar_url,
            url: payload.repository.html_url
        }
    },

    deployment: (payload) => {
        return {
            title: `New deployment`,
            body: `Repository: ${payload.repository.full_name}`,
            icon: payload.sender.avatar_url,
            url: payload.deployment.url
        }
    },

    deployment_status: (payload) => {
        return {
            title: `Deployment Status:`,
            body: `${payload.deployment_status.state}`,
            icon: payload.sender.avatar_url,
            url: payload.deployment_status.url
        }
    },

    fork: (payload) => {
        return {
            title: `A new fork was created`,
            body: `${payload.forkee.name}`,
            icon: payload.sender.avatar_url,
            url: payload.forkee.forks_url
        }
    },

    gist: (payload) => {
        return {
            title: `Github Gist`,
            body: `${payload.actions}`,
            icon: payload.sender.avatar_url,
            url: ''
        }
    },

    gollum: (payload) => {
        return {
            title: `Wiki updated`,
            body: `${payload.pages[0].page_name} was ${payload.pages[0].action}`,
            icon: `${payload.sender.avatar_url}`,
            url: payload.pages[0].html_url
        }
    },

    installation: (payload) => {
        return {
            title: `A github app was ${payload.action}`,
            body: `By ${payload.installation.account.login}`,
            icon: payload.sender.avatar_url,
            url: payload.installation.repositories_url
        }
    },

    installation_repositories: (payload) => {
        return {
            title: `Repository ${payload.action} from installation`,
            body: `By ${payload.sender.login}`,
            icon: payload.sender.avatar_url,
            url: payload.installation.html_url
        }
    },

    issue_comment: (payload) => {
        return {
            title: `Issue comment ${payload.action}`,
            body: `${payload.issue.title}`,
            icon: payload.sender.avatar_url,
            url: payload.issue.url
        }
    },

    issues: (payload) => {
        return {
            title: `Issue ${payload.action}`,
            body: `${payload.issue.title}`,
            icon: payload.sender.avatar_url,
            url: payload.issue.url
        }
    },

    label: (payload) => {
        return {
            title: `Repository label ${payload.action}`,
            body: `${payload.label.name}`,
            icon: payload.sender.avatar_url,
            url: payload.label.url
        }
    },

    marketplace_purchase: (payload) => {
        return {
            title: `Marketplace ${payload.action}`,
            body: `Billing to ${payload.marketplace_purchase.account.organization_billing_email}`,
            icon: payload.sender.avatar_url,
            url: ''
        }
    },

    member: (payload) => {
        return {
            title: `Member ${payload.action}`,
            body: `${payload.member.login}`,
            icon: payload.sender.avatar_url,
            url: payload.repository.html_url
        }
    },

    membership: (payload) => {
        return {
            title: `User ${payload.action} for ${payload.team.name}`,
            body: `${payload.member.login}`,
            icon: payload.sender.avatar_url,
            url: payload.team.members_url
        }
    },

    milestone: (payload) => {
        return {
            title: `Milestone was ${payload.action}`,
            body: `${payload.milestone.title}`,
            icon: payload.sender.avatar_url,
            url: payload.milestone.url
        }
    },

    organization: (payload) => {
        return {
            title: `${payload.organization.login} ${payload.action}`,
            body: `${payload.invitation.login}: ${payload.invitation.role}`,
            icon: payload.sender.avatar_url,
            url: payload.membership.organization_url
        }
    },

    org_block: (payload) => {
        return {
            title: `${payload.organization.login}`,
            body: `${payload.blocked_user}: ${payload.action}`,
            icon: payload.sender.avatar_url,
            url: payload.blocked_user.url
        }
    },

    page_build: (payload) => {
        return {
            title: `GitHub Page`,
            body: `Status: ${payload.build.status}`,
            icon: `${payload.build.pusher.avatar_url}`,
            url: payload.build.url
        }
    },

    project_card: (payload) => {
        return {
            title: `Project card ${payload.action}`,
            body: `By ${payload.sender.login}`,
            icon: payload.sender.avatar_url,
            url: payload.project_card.url
        }
    },

    project_column: (payload) => {
        return {
            title: `Project Column ${payload.action}`,
            body: `By ${payload.sender.login}`,
            icon: `${payload.sender.avatar_url}`,
            url: payload.project_column.url
        }
    },

    project: (payload) => {
        return {
            title: `Project ${payload.action}`,
            body: `${payload.project.body}`,
            icon: payload.project.creator.url,
            url: payload.project.url
        }
    },

    public: (payload) => {
        return {
            title: `Repo ${payload.repository.name} Made Public`,
            body: `By ${payload.sender.login}`,
            icon: `${payload.sender.avatar_url}`,
            url: payload.repository.html_url
        }
    },

    pull_request: (payload) => {
        return {
            title: `Pull Request ${payload.action}`,
            body: `${payload.pull_request.body}`,
            icon: payload.sender.avatar_url,
            url: payload.pull_request.html_url
        }
    },

    pull_request_review: (payload) => {
        return {
            title: `Pull Request Review ${payload.action}`,
            body: `${payload.review.body}`,
            icon: ``,
            url: payload.review.html_url
        }
    },

    pull_request_review_comment: (payload) => {
        return {
            title: `Review Comment: ${payload.action}`,
            body: `${payload.comment.body}`,
            icon: payload.sender.avatar_url,
            url: payload.comment.html_url
        }
    },

    release: (payload) => {
        return {
            title: `New Release Published`,
            body: `${payload.release.body}`,
            icon: payload.sender.avatar_url,
            url: payload.release.html_url
        }
    },

    repository: (payload) => {
        return {
            title: `Repository ${payload.action}`,
            body: `By ${payload.sender.login}`,
            icon: payload.sender.avatar_url,
            url: payload.repository.html_url
        }
    },

    status: (payload) => {
        return {
            title: `Git Commit Status: ${payload.state}`,
            body: `${payload.description}`,
            icon: payload.sender.avatar_url,
            url: payload.commit.html_url
        }
    },

    team: (payload) => {
        return {
            title: `Team ${payload.action}`,
            body: `Name: ${payload.team.name}`,
            icon: payload.sender.avatar_url,
            url: payload.team.url
        }
    },

    team_add: (payload) => {
        return {
            title: `Team ${payload.team.name} Added`,
            body: `..to ${payload.repository.name}`,
            icon: payload.sender.avatar_url,
            url: payload.team.url
        }
    },

    watch: (payload) => {
        return {
            title: `Watch Started`,
            body: `For ${payload.repository.name}`,
            icon: payload.sender.avatar_url,
            url: payload.repository.html_url
        }
    },

    sub: payload => {
        return {
            title: 'Notifications activated',
            body: 'Change which organisations you receive notices for anytime.',
            icon: payload.sender.avatar_url,
            url: 'http://www.chinese5k.com'
        }
    },

    push: payload => {
        return {
            title: `Push to ${payload.repository.name} by ${payload.sender.login}`,
            body: payload.head_commit.message,
            icon: payload.sender.avatar_url,
            url: payload.compare
        }
    },

    ping: payload => {
        return {
            title: `Subscribed to ${subscribedEventsFormatter(payload.hook.events)} for ${payload.organization.login}`,
            body: `${payload.zen}`,
            icon: payload.organization.avatar_url,
            url: payload.organization.url,
        }
    }
};

// title
// body
// icon
// badge