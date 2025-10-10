const { validationResult } = require('express-validator');

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.validationErrors = errors.array();
        return next();
    }
    next();
}

module.exports = {
    validate,
};