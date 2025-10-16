const { matchedData } = require('express-validator');
const { getCategoryById } = require('../db/categoryQueries');
const { getMaterialProtectStatus } = require('../db/materialQueries');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const password = process.env.APP_PASSWORD || '';

function isAuthorized(isProtected, req) {
    if (!isProtected) {
        return true;
    }
    if (req.body?.password === password) {
        return true;
    }
    return false;
}

async function categoryOpAuth(req, res, next) {
    const { categoryId } = req.params;
    const category = await getCategoryById(categoryId);
    let isProtected = category[0].is_protected;
    if (isAuthorized(isProtected, req)) {
        return next();
    }
    throw new UnauthorizedError("Invalid credentials. Please try again.");
}

function auth(req, res, next) {
    const authorized = ({ currentProtectStatus, inputProtectStatus, inputPassword} ) => {
        if (currentProtectStatus || inputProtectStatus) {
            return inputPassword === password;
        } 
        return true;
    }
    req.authorized = authorized;
    next();
}

module.exports = {
    categoryOpAuth,
    auth,
};