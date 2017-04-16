'use strict';

'use strict';

let router = require('express').Router();

router.route('/')
    .get(function (req, res) {
        res.render('home', { env: env });
    });

module.exports = router;