'use strict';

module.exports = userIdParam => {

    if (userIdParam.length === 8 && !isNaN(Number(userIdParam))) {
        return userIdParam;
    } else {
        return false;
    }

};