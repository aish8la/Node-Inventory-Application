const db = require('./index');

async function addCategory({ categoryName, categoryFor, isProtected = false}) {
    const addCategorySQL = {
        text: `INSERT INTO categories (category_name, category_for, is_protected)
                SELECT $1, cat_map_id, $3
                FROM category_map
                WHERE cat_mapped_to=$2
               RETURNING category_id;`,
        values: [categoryName, categoryFor, isProtected]
    };
    const result = await db.query(addCategorySQL);
    if (result.rowCount === 0) {
        throw new Error("insert failed");//TODO use a better error
    }
    return result;
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
    const getCategoryTypes = `SELECT cat_mapped_to
                                FROM cat_map_id;`
    const result = await db.query(getCategoryTypes);
    return result;
}

module.exports = {
    addCategory,
    getAllCategories,
    getAllCategoryTypes,
};