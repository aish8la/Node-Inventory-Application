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
        throw error;
    }
}

async function getAllCategories() {
    const viewCategorySQL = `SELECT ct.category_id, ct.category_name, ct.category_for, cmt.cat_mapped_to, ct.is_protected
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

async function getCategoryById(id) {
    const getCategory = { 
        text: `SELECT ct.category_id, ct.category_name, ct.category_for, cmt.cat_mapped_to, ct.is_protected
                FROM categories AS ct 
                LEFT OUTER JOIN category_map AS cmt 
                ON ct.category_for = cmt.cat_map_id
                WHERE ct.category_id=$1;`,
        values: [id]
    };
    const result = await db.query(getCategory)
    return result.rows;
}

async function editCategory({ categoryId, categoryName, categoryTypeId, isProtected }) {
    const editCategory = {
        text: `UPDATE categories 
                SET category_name = $1, category_for = $2, is_protected = $3
                WHERE category_id = $4;`,
        values: [categoryName, categoryTypeId, isProtected, categoryId],
    };
    return await db.query(editCategory);
}

module.exports = {
    addCategory,
    getAllCategories,
    getAllCategoryTypes,
    getCategoryById,
    editCategory,
};