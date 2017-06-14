'use strict';

function formatNotification(event, payload) {

    let notice = new Object();
    notice.event = event;

    try {

        if (payload.organization) {
            notice.organization = payload.organization.id;

        } else if (payload.repository) {
            notice.repository = payload.repository.id;

        }

        console.log(notice);
        return notice;

    } catch (e) {
        console.error(e, event, reqBody);
    }

}

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