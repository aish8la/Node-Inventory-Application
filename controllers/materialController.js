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
    if (res.validationErrors) {
        const formData = {
            ...validatedInput,
            categoryList: await db.getMaterialCategories()
        }
        return res.render('material/form', {
            subtitle: 'Fab Inventory | New Material',
            mode: 'new',
            formData,
            formErrors: res.validationErrors,
        });
    }
    await db.addMaterial({
        materialName: validatedInput.materialName,
        materialDescription: validatedInput.materialDescription,
        stockInHand: validatedInput.stockInHand,
        isProtected: validatedInput.isProtected,
        categoriesId: validatedInput.categoriesId,
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
        inputProtectStatus: validatedInput.isProtected,
        inputPassword: req.body?.password,
    });
    if (res.validationErrors || !authorized) {
        return res.render('material/form', {
            subtitle: 'Fab Inventory | Edit Material',
            mode: 'edit',
            formData: {
                ...validatedInput,
                materialId,
                categoryList,
                passwordIsRequired: !authorized
            },
            formErrors: res?.validationErrors,
        });
    }
    await db.editMaterial({
        materialId: materialId,
        materialName: validatedInput.materialName,
        description: validatedInput.materialDescription,
        isProtected: validatedInput.isProtected,
        stockInHand: validatedInput.stockInHand,
        categories: validatedInput.categoriesId,
    });
    res.redirect('/material');
}

module.exports = {
    materialsGet,
    newMaterialGet,
    newMaterialPost,
    editMaterialGet,
    editMaterialPost,
};