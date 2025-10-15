const db = require('../db/materialQueries');
const { matchedData } = require('express-validator');

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

module.exports = {
    materialsGet,
    newMaterialGet,
    newMaterialPost
};