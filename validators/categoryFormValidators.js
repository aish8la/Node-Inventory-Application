const { body } = require('express-validator');

const categoryAddEditValidation = [
    body('categoryName')
        .trim()
        .escape()
        .notEmpty().withMessage('Category Name cannot be empty')
        .isLength({min: 1, max: 50}).withMessage('Category name must be between 1 to 50 characters long'),
    body('categoryType')
        .trim()
        .isInt()
        .notEmpty().withMessage('Category Type cannot be empty'),
];

module.exports = categoryAddEditValidation;