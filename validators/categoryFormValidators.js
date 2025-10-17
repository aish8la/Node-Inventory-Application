const { body, param } = require('express-validator');

const addValidation = [
    body('category_name')
        .trim()
        .escape()
        .notEmpty().withMessage('Category Name cannot be empty')
        .isLength({min: 1, max: 50}).withMessage('Category name must be between 1 to 50 characters long'),
    body('category_type')
        .trim()
        .isInt()
        .notEmpty().withMessage('Category Type cannot be empty'),
    body('is_protected')
        .toBoolean()
];

const paramValidation = [
    param('categoryId')
        .isInt().withMessage("Category Id Id must be an integer"),
]

const editValidation = [
    addValidation,
    paramValidation
];

module.exports = {
    addValidation,
    paramValidation,
    editValidation
};