const { matchedData } = require('express-validator');
const db = require('../db/categoryQueries');

async function categoryGet(req, res) {
    const categories = await db.getAllCategories();
    res.render('category/list', { title: 'Fab Inventory | Categories', categories: categories});
}

async function newCategoryGet(req, res) {
    const categoryTypes = await db.getAllCategoryTypes();
    res.render('category/form', {
        categoryTypes: categoryTypes.rows,
        mode: 'new',
        category: {}
    });
}

async function newCategoryPost(req, res) {
    const categoryTypes = await db.getAllCategoryTypes();
    if (res.validationErrors) {
        return res.render('category/form', {
            mode: 'new',
            formErrors: res.validationErrors,
            categoryTypes: categoryTypes.rows,
            category: {}
        });
    }
    const { categoryName, categoryType } = matchedData(req);
    const isProtected = req.body.isProtected ? true : false;
    await db.addCategory({ categoryName: categoryName, categoryFor: categoryType, isProtected: isProtected });
    res.redirect('/category');
}

async function editCategoryGet(req, res) {
    const { categoryId } = req.params;
    const categoryData = await db.getCategoryById(categoryId);
    const categoryTypes = await db.getAllCategoryTypes();
    res.render('category/form', {
        mode: 'edit',
        category: categoryData[0],
        categoryTypes: categoryTypes.rows
    });
}

async function editCategoryPost(req, res) {
    const { categoryId } = req.params;
    const categoryTypes = await db.getAllCategoryTypes();
    const categoryData = await db.getCategoryById(categoryId);
    if (res.validationErrors) {
        return res.render('category/form', {
            mode: 'edit',
            formErrors: res.validationErrors,
            categoryTypes: categoryTypes.rows,
            category: categoryData[0],
        });
    }
    const { categoryName, categoryType } = matchedData(req);
    const isProtected = req.body.isProtected ? true : false;
    await db.editCategory({ categoryId: categoryId, categoryName: categoryName, categoryTypeId: categoryType, isProtected: isProtected});
    res.redirect('/category');
}

async function deleteCategoryPost(req, res) {
    const { categoryId } = req.params;
    await db.deleteCategory(categoryId);
    res.redirect('/category');
}

async function deleteCategoryGet(req, res) {
    const { categoryId } = req.params;
    const categoryData = await db.getCategoryById(categoryId);
    res.render('confirmDelete', {
        title: 'Fab Inventory | Delete Category',
        path: req.baseUrl + '/' + categoryId + '/delete',
        message: `Delete Category "${categoryData[0].category_name}"`,
        isProtected: categoryData[0].is_protected,
    });
}

module.exports = {
    categoryGet,
    newCategoryGet,
    newCategoryPost,
    editCategoryGet,
    editCategoryPost,
    deleteCategoryPost,
    deleteCategoryGet,
};