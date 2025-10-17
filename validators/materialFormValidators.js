const { body, param } = require('express-validator');

const addValidation = [
    body('material_name')
        .trim()
        .escape()
        .notEmpty().withMessage('Material Name cannot be empty')
        .isLength({min: 1, max: 50}).withMessage('Material name must be between 1 to 50 characters long'),
    body('material_description')
        .trim()
        .isLength({ max: 500 }).withMessage('Description must not be more than 500 characters long'),
    body('stock_in_hand')
        .trim()
        .isInt().withMessage('Stock Quantity must be a number'),
    body('categories')
        .toArray(),
    body('is_protected')
        .toBoolean()
];

const paramValidation = [
    param('materialId')
        .isInt().withMessage("Material Id must be an integer"),
]

const editValidation = [
    addValidation,
    paramValidation
];

module.exports = {
    addValidation,
    paramValidation,
    editValidation,
};