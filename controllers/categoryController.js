const db = require('../db/queries');

async function categoryGet(req, res) {
    const categories = await db.getAllCategories();
    res.render('category', { title: 'Fab Inventory | Categories', categories: categories});
}

module.exports = {
    categoryGet,
};