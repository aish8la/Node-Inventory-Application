const { validationResult } = require('express-validator');

function handleInputFormErr(ejsTemplate) {
    return (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render(ejsTemplate, { errors: errors.array() });
        }
        next();
    }
}

module.exports = {
    handleInputFormErr,
};