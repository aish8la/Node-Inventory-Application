const pool = require('./pool');

async function addCategory({ categoryName, categoryFor, isProtected = false}) {
    const addCategorySQL = {
        text: `INSERT INTO categories (category_name, category_for, is_protected)
                SELECT $1, cat_map_id, $3
                FROM category_map
                WHERE cat_mapped_to=$2;`,
        values: [categoryName, categoryFor, isProtected]
    };
    await pool.query(addCategorySQL);
}

async function getAllCategories() {
    const viewCategorySQL = `SELECT ct.category_id, ct.category_name, cmt.cat_mapped_to, ct.is_protected
                                FROM categories AS ct 
                                LEFT OUTER JOIN category_map AS cmt 
                                ON ct.category_for = cmt.cat_map_id;`
    const result = await pool.query(viewCategorySQL);
    return result.rows
}

module.exports = {
    addCategory,
    getAllCategories,
};