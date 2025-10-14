const { validationResult } = require('express-validator');

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.validationErrors = { 
            errorArray: errors.array(),
            errorMap: errors.mapped(),
        }
        return next();
    }
    next();
}

module.exports = {
    validate,
};