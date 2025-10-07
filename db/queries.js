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