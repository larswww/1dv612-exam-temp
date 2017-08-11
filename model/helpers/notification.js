'use strict';
const payloadHandler = require('./payloadHandler');

function formatNotification(userID, event, payload) {

    let notice = {};
    notice.event = event;
    notice.forUser = userID; // todo verify the UID

    try {

        notice.notification = payloadHandler(event, payload);

        console.log(notice);
        return notice;

    } catch (e) {
        console.error(e, event, payload);
    }
}

// get the xgithub event type and the payload itself, safely JSON parse that.

function getText(event) {
    let text;

    switch (event) {
        case '*':
            text = 'New github activity';
            break;
        case 'label':
            text = 'A label was edited, created or updated';
            break;

    }

    return text;
}


exports.format = formatNotification;
exports.getText = getText;