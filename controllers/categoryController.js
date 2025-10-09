const db = require('../db/categoryQueries');

async function categoryGet(req, res) {
    const categories = await db.getAllCategories();
    res.render('category/list', { title: 'Fab Inventory | Categories', categories: categories});
}

function newCategoryGet(req, res) {
    res.render('category/form');
}

module.exports = {
    categoryGet,
    newCategoryGet
};