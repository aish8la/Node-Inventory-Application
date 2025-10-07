const db = require('../db/queries');

async function categoryGet(req, res) {
    const categories = await db.getAllCategories();
    console.log(categories);
    res.render('category', { title: 'Fab Inventory | Categories', categories: categories});
}

module.exports = {
    categoryGet,
};