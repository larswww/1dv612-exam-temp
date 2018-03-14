'use strict'

const jwt = require('jsonwebtoken');
const db = require('./db')
let decoded;

module.exports = async function authorize(req, res, next) {
    const token = req.headers.authorization;

    if (token === undefined) {
        return next({message: 'There was no token in the header', statusCode: 401 });
    }

    try {
        decoded = await jwt.verify(token, process.env.jwt_secret);
        const user = await db.handleLogin(decoded)
        if (!user) return next({error: true, message: 'Invalid token', statusCode: 401})

        res.locals.accessToken = decoded.accessToken;
        res.locals.role = decoded.role;
        res.locals.user = user;

        return next();
    } catch(e) {
        return next(e);
    }
};