const { getCategoryById } = require('../db/categoryQueries');
const UnauthorizedError = require('../errors/UnauthorizedError');
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

module.exports = {
    categoryOpAuth,
};