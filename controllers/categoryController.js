const { matchedData } = require('express-validator');
const db = require('../db/categoryQueries');
const validateCategoryAddEdit = require('./validation/categoryFormValidators');

async function categoryGet(req, res) {
    const categories = await db.getAllCategories();
    res.render('category/list', { title: 'Fab Inventory | Categories', categories: categories});
}

function newCategoryGet(req, res) {
    res.render('category/form');
}

const newCategoryPost = [
    validateCategoryAddEdit,
    async (req, res) => {
        const { categoryName, categoryType, isProtected = false } = matchedData(req);
        const result = await db.addCategory({ categoryName: categoryName, categoryFor: categoryType, isProtected: isProtected });
        res.redirect('/category');
    }
]

module.exports = {
    categoryGet,
    newCategoryGet,
    newCategoryPost,
};