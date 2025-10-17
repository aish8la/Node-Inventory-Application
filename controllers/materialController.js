const db = require('../db/materialQueries');
const { matchedData } = require('express-validator');
const NotFoundError = require('../errors/NotFoundError');

async function materialsGet(req, res) {
    const materials = await db.getAllMaterials();
    res.render('material/list', {
        title: 'Fab Inventory | Categories',
        materials: materials,
    });
}

async function newMaterialGet(req, res) {
    const categoryList = await db.getMaterialCategories();
    const formData = {
        categoryList,
    };
    res.render('material/form', {
        subtitle: 'Fab Inventory | New Material',
        mode: 'new',
        formData,
    });
}

async function newMaterialPost(req, res) {
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
            categoryList: await db.getMaterialCategories(),
            passwordIsRequired: !authorized
        }
        return res.render('material/form', {
            subtitle: 'Fab Inventory | New Material',
            mode: 'new',
            formData,
            formErrors: res?.validationErrors,
        });
    }
    await db.addMaterial({
        materialName: validatedInput.material_name,
        materialDescription: validatedInput.material_description,
        stockInHand: validatedInput.stock_in_hand,
        isProtected: validatedInput.is_protected,
        categoriesId: validatedInput.categories_id,
    });
    res.redirect('/material');
}

async function editMaterialGet(req, res) {
    const { materialId } = matchedData(req, { locations: ['params'] });
    if (!materialId) throw new NotFoundError('Oops! The page you are looking for does not exist.');
    const materialData = await db.getMaterialById(materialId);
    if (!materialData) throw new NotFoundError('Oops! The item you are looking for does not exist.');
    const categoryList = await db.getMaterialCategories();
    res.render('material/form', {
        subtitle: 'Fab Inventory | Edit Material',
        mode: 'edit',
        formData: {...materialData, categoryList},
    });
}

async function editMaterialPost(req, res) {
    const { materialId } = matchedData(req, { locations: ['params'] });
    if (!materialId) throw new NotFoundError('Oops! The page you are looking for does not exist.');
    const validatedInput = matchedData(req, { locations: ['body'], onlyValidData: false });
    const categoryList = await db.getMaterialCategories();
    const currentProtectStatus = await db.getMaterialProtectStatus(materialId);
    const authorized = req?.authorized({
        currentProtectStatus: currentProtectStatus.is_protected,
        inputProtectStatus: validatedInput.is_protected,
        inputPassword: req.body?.password,
    });
    if (res.validationErrors || !authorized) {
        return res.render('material/form', {
            subtitle: 'Fab Inventory | Edit Material',
            mode: 'edit',
            formData: {
                ...validatedInput,
                material_id: materialId,
                categoryList,
                passwordIsRequired: !authorized
            },
            formErrors: res?.validationErrors,
        });
    }
    await db.editMaterial({
        materialId: materialId,
        materialName: validatedInput.material_name,
        description: validatedInput.material_description,
        isProtected: validatedInput.is_protected,
        stockInHand: validatedInput.stock_in_hand,
        categories: validatedInput.categories_id,
    });
    res.redirect('/material');
}

async function deleteMaterialGet(req, res) {
    const { materialId } = matchedData(req, { locations: ['params'] });
    if (!materialId) throw new NotFoundError('Oops! The page you are looking for does not exist.');
    const materialData = await db.getMaterialById(materialId);
    if (!materialData) throw new NotFoundError('Oops! The item you are looking for does not exist.');
    res.render('confirmDelete', {
        title: 'Fab Inventory | Delete Material',
        path: req.baseUrl + '/' + materialId + '/delete',
        message: `Delete Material "${materialData.material_name}"`,
        isProtected: materialData.is_protected,
    });
}

module.exports = {
    materialsGet,
    newMaterialGet,
    newMaterialPost,
    editMaterialGet,
    editMaterialPost,
    deleteMaterialGet,
};