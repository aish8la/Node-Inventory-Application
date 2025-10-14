const db = require('../db/materialQueries');

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
        mode: 'new',
        formData,
    });
}

module.exports = {
    materialsGet,
    newMaterialGet,
};