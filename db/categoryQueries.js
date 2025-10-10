const db = require('./index');

async function addCategory({ categoryName, categoryFor, isProtected = false}) {
    const addCategorySQL = {
        text: `INSERT INTO categories (category_name, category_for, is_protected)
                VALUES ($1, $2, $3);`,
        values: [categoryName, categoryFor, isProtected]
    };
    try {
        const result = await db.query(addCategorySQL);
        return result;
    } catch (error) {
        if(error.code === '23503') {
            throw new Error('Invalid category type');
        }
        throw error; //TODO add better errors
    }
}

async function getAllCategories() {
    const viewCategorySQL = `SELECT ct.category_id, ct.category_name, cmt.cat_mapped_to, ct.is_protected
                                FROM categories AS ct 
                                LEFT OUTER JOIN category_map AS cmt 
                                ON ct.category_for = cmt.cat_map_id;`
    const result = await db.query(viewCategorySQL);
    return result.rows
}

async function getAllCategoryTypes() {
    const getCategoryTypes = `SELECT cat_map_id, cat_mapped_to
                                FROM category_map;`
    const result = await db.query(getCategoryTypes);
    return result;
}

module.exports = {
    addCategory,
    getAllCategories,
    getAllCategoryTypes,
};