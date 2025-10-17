const db = require('./index');

async function addCategory({ categoryName, categoryFor, isProtected = false}) {
    const addCategorySQL = {
        text: `INSERT INTO categories (category_name, category_for, is_protected)
                VALUES ($1, $2, $3);`,
        values: [categoryName, categoryFor, isProtected]
    };
    const result = await db.query(addCategorySQL);
    return result;
}

async function getAllCategories() {
    const viewCategorySQL = `SELECT ct.category_id, ct.category_name, ct.category_for, cmt.cat_mapped_to, ct.is_protected
                                FROM categories AS ct 
                                LEFT OUTER JOIN category_map AS cmt 
                                ON ct.category_for = cmt.cat_map_id
                            ORDER BY ct.category_id;`
    const result = await db.query(viewCategorySQL);
    return result.rows;
}

async function getAllCategoryTypes() {
    const getCategoryTypes = `SELECT cat_map_id, cat_mapped_to
                                FROM category_map;`
    const result = await db.query(getCategoryTypes);
    return result.rows;
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
    return result.rows[0];
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

async function deleteCategory(id) {
    const deleteCategory = {
        text: `DELETE FROM categories
                WHERE category_id = $1;`,
        values: [id],
    };
    const result = await db.query(deleteCategory);
    return result;
}

async function categoryIsUsed(categoryId) {
    const SQL = {
        text: `SELECT 1
                WHERE EXISTS (SELECT 1 FROM material_categories WHERE category_id = $1)
                    EXISTS (SELECT 1 FROM product_categories WHERE category_id = $1);`,
        values: [categoryId],
    }
    const result = await db.query(SQL);
    return result.rowCount > 0;
}

module.exports = {
    addCategory,
    getAllCategories,
    getAllCategoryTypes,
    getCategoryById,
    editCategory,
    deleteCategory,
    categoryIsUsed,
};