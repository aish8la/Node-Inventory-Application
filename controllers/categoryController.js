const { matchedData } = require('express-validator');
const db = require('../db/categoryQueries');
const validateCategoryAddEdit = require('./validation/categoryFormValidators');

async function categoryGet(req, res) {
    const categories = await db.getAllCategories();
    res.render('category/list', { title: 'Fab Inventory | Categories', categories: categories});
}

async function newCategoryGet(req, res) {
    const categoryTypes = await db.getAllCategoryTypes();
    res.render('category/form', { categoryTypes: categoryTypes.rows });
}

const newCategoryPost = [
    validateCategoryAddEdit,
    async (req, res) => {
        const { categoryName, categoryType } = matchedData(req);
        const isProtected = req.body.isProtected ? true : false;
        const result = await db.addCategory({ categoryName: categoryName, categoryFor: categoryType, isProtected: isProtected });
        res.redirect('/category');
    }
]

module.exports = {
    categoryGet,
    newCategoryGet,
    newCategoryPost,
};