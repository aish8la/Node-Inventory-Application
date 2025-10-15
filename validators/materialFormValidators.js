const { body } = require('express-validator');

const addValidation = [
    body('materialName')
        .trim()
        .escape()
        .notEmpty().withMessage('Material Name cannot be empty')
        .isLength({min: 1, max: 50}).withMessage('Material name must be between 1 to 50 characters long'),
    body('materialDescription')
        .trim()
        .isLength({ max: 500 }).withMessage('Description must not be more than 500 characters long'),
    body('stockInHand')
        .trim()
        .isInt().withMessage('Stock Quantity must be a number'),
    body('categoriesId')
        .toArray(),
    body('isProtected')
        .toBoolean()
];

module.exports = {
    addValidation,
};