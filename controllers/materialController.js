const db = require('../db/materialQueries');

async function materialsGet(req, res) {
    const materials = await db.getAllMaterials();
    res.render('material/list', {
        title: 'Fab Inventory | Categories',
        materials: materials,
    });
}

module.exports = {
    materialsGet,
};