const { matchedData } = require('express-validator');
const db = require('../db/categoryQueries');
const NotFoundError = require('../errors/NotFoundError');

async function categoryGet(req, res) {
    const categories = await db.getAllCategories();
    res.render('category/list', { title: 'Fab Inventory | Categories', categories: categories});
}

async function newCategoryGet(req, res) {
    const categoryTypeList = await db.getAllCategoryTypes();
    const formData = {
        categoryTypeList,
    };
    res.render('category/form', {
        subtitle: 'New Category',
        mode: 'new',
        formData,
    });
}

async function newCategoryPost(req, res) {
    const validatedInput = matchedData(req, {
        onlyValidData: false,
        locations: ['body'],
    });
    const authorized = req?.authorized({
        currentProtectStatus: false,
        inputProtectStatus: validatedInput.is_protected,
        inputPassword: req.body?.password,
    });
    if (res.validationErrors || !authorized) {
        const formData = {
            ...validatedInput,
            categoryTypeList: await db.getAllCategoryTypes(),
            passwordIsRequired: !authorized
        };
        return res.render('category/form', {
            subtitle: 'New Category',
            mode: 'new',
            formData,
            formErrors: res?.validationErrors,
        });
    }
    await db.addCategory({
        categoryName: validatedInput.category_name,
        categoryFor: validatedInput.category_type,
        isProtected: validatedInput.is_protected
    });
    res.redirect('/category');
}

async function editCategoryGet(req, res) {
    const { categoryId } = matchedData(req, { locations: ['params'] });
    if (!categoryId) throw new NotFoundError('Oops! The page you are looking for does not exist.');
    const categoryData = await db.getCategoryById(categoryId);
    if (!categoryData) throw new NotFoundError('Oops! The item you are looking for does not exist.');
    const categoryTypeList = await db.getAllCategoryTypes();
    res.render('category/form', {
        subtitle: 'Edit Category',
        mode: 'edit',
        formData: {
            ...categoryData,
            categoryTypeList
        },
    });
}

async function editCategoryPost(req, res) {
    const { categoryId } = matchedData(req, { locations: ['params'] });
    if (!categoryId) throw new NotFoundError('Oops! The page you are looking for does not exist.');
    const categoryData = await db.getCategoryById(categoryId);
    if (!categoryData) throw new NotFoundError('Oops! The item you are looking for does not exist.');
    const validatedInput = matchedData(req, { locations: ['body'], onlyValidData: false });
    const categoryTypeList = await db.getAllCategoryTypes();
    const authorized = req?.authorized({
        currentProtectStatus: categoryData.is_protected,
        inputProtectStatus: validatedInput.is_protected,
        inputPassword: req.body?.password,
    });
    if (res.validationErrors || !authorized) {
        return res.render('category/form', {
            subtitle: 'Edit Category',
            mode: 'edit',
            formData: {
                ...validatedInput,
                category_id: categoryId,
                categoryTypeList,
                passwordIsRequired: !authorized
            },
            formErrors: res?.validationErrors,
        });
    }
    await db.editCategory({
        categoryId: categoryId,
        categoryName: validatedInput.category_name,
        categoryTypeId: validatedInput.category_type,
        isProtected: validatedInput.is_protected,
    });
    res.redirect('/category');
}

async function deleteCategoryGet(req, res) {
    const { categoryId } = matchedData(req, { locations: ['params'] });
    if (!categoryId) throw new NotFoundError('Oops! The page you are looking for does not exist.');
    const categoryData = await db.getCategoryById(categoryId);
    if (!categoryData) throw new NotFoundError('Oops! The item you are looking for does not exist.');
    res.render('confirmDelete', {
        title: 'Fab Inventory | Delete Category',
        path: req.baseUrl + '/' + categoryId + '/delete',
        message: `Delete Category "${categoryData.category_name}"`,
        isProtected: categoryData.is_protected,
    });
}

async function deleteCategoryPost(req, res) {
    const { categoryId } = matchedData(req, { locations: ['params'] });
    if (!categoryId) throw new NotFoundError('Oops! The page you are looking for does not exist.');
    const categoryData = await db.getCategoryById(categoryId);
    if (!categoryData) throw new NotFoundError('Oops! The item you are looking for does not exist.');
    const authorized = req?.authorized({
        currentProtectStatus: categoryData.is_protected,
        inputProtectStatus: false,
        inputPassword: req.body?.password,
    });
    if (!authorized) {
        return res.render('confirmDelete', {
            title: 'Fab Inventory | Delete Category',
            path: req.baseUrl + '/' + categoryId + '/delete',
            message: `Delete Category "${categoryData.category_name}"`,
            isProtected: categoryData.is_protected,
            passwordIsRequired: !authorized
        });
    }
    await db.deleteCategory(categoryId);
    res.redirect('/category');
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