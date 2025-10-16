const db = require('./index');

async function getAllMaterials() {
    const getAllMaterialsSQL = `
    SELECT m.material_id, m.material_name, m.material_description, m.is_protected, m.stock_in_hand, mc.category_id, c.category_name
    FROM materials m
    LEFT JOIN material_categories mc
    ON m.material_id = mc.material_id
    LEFT JOIN categories c
    ON mc.category_id = c.category_id
    ORDER BY m.material_id, mc.category_id;`;

    const result = await db.query(getAllMaterialsSQL);
    const rows = result.rows.reduce((accumulator, currentRow) => {
        if (!accumulator[currentRow.material_id]) {
            accumulator[currentRow.material_id] = {
                material_id: currentRow.material_id,
                material_name: currentRow.material_name,
                material_description: currentRow.material_description,
                is_protected: currentRow.is_protected,
                stock_in_hand: currentRow.stock_in_hand,
                categories: [],
            };
        };
        if (currentRow.category_id) {
            accumulator[currentRow.material_id].categories.push({
                category_id: currentRow.category_id,
                category_name: currentRow.category_name,
            });
        }
        return accumulator;
    }, {});
    const finalArr = Object.values(rows);
    return finalArr
}

async function addMaterial({ materialName, materialDescription, isProtected, stockInHand, categoriesId = [] }) {
    const materialInsertSQL = {
        text: `INSERT INTO materials (material_name, material_description, is_protected, stock_in_hand)
                VALUES ($1, $2, $3, $4)
                RETURNING material_id;`,
        values: [materialName, materialDescription, isProtected, stockInHand],
    };

    const categoryInsertSQL = {
        name: 'insert-categories',
        text: `INSERT INTO material_categories (material_id, category_id)
                SELECT $1, c.category_id
                FROM categories c
                JOIN category_map cm
                ON c.category_for = cm.cat_map_id
                WHERE cm.cat_mapped_to = 'Material' AND c.category_id = ANY($2::int[]);`,
        values: []
    }

    const uniqueCategoryIds = [... new Set(categoriesId)];

    const client = await db.getClient();

    try {
        await client.query('BEGIN');
        const insertResult = await client.query(materialInsertSQL);
        if (insertResult.rowCount === 0) throw new Error('Failed to add material');
        const materialId = insertResult.rows[0].material_id;

        if (uniqueCategoryIds.length > 0) {
            categoryInsertSQL.values[0] = materialId;
            categoryInsertSQL.values[1] = uniqueCategoryIds;
            const categoryResult = await client.query(categoryInsertSQL);
            if (categoryResult.rowCount !== uniqueCategoryIds.length) {
                throw new Error('Failed to add category to material');
            }
        }
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function getMaterialCategories() {
    const SQL = `
    SELECT c.category_id, c.category_name
        FROM categories c
        JOIN category_map cm
            ON c.category_for = cm.cat_map_id
        WHERE cm.cat_mapped_to = 'Material';`;
    const result = await db.query(SQL);
    return result.rows;
}

async function getMaterialProtectStatus(materialId) {
    if (!materialId) return;
    const SQL = {
        text: `SELECT material_id, is_protected
                FROM materials
                WHERE material_id = $1
                LIMIT 1;`,
        value: [materialId]
    }
    const result = await db.query(SQL);
    return result.rows[0];
}

async function getMaterialById(materialId) {
    if (!materialId) return;
    const SQL = {
        text: `SELECT m.material_id, m.material_name, m.material_description, m.is_protected, m.stock_in_hand, mc.category_id, c.category_name
                FROM materials m
                LEFT JOIN material_categories mc
                ON m.material_id = mc.material_id
                LEFT JOIN categories c
                ON mc.category_id = c.category_id
                WHERE m.material_id = $1
                ORDER BY m.material_id, mc.category_id;`,
        values: [materialId]
    }
    const result = await db.query(SQL);
    if (!result.rows[0]) return;
    const materialData = {
        material_id: result.rows[0].material_id,
        material_name: result.rows[0].material_name,
        material_description: result.rows[0].material_description,
        is_protected: result.rows[0].is_protected,
        stock_in_hand: result.rows[0].stock_in_hand,
        categories: result.rows.map(row => ({ category_id: row.category_id, category_name: row.category_name }) ),
    }
    return materialData;
}

async function editMaterial({ materialId, materialName, description, isProtected, stockInHand, categories = [] } = {}) {
    if(!materialId) return;

    const editMaterialSQL = {
        text: `UPDATE materials
                SET material_name = $1,
                    material_description = $2,
                    is_protected = $3,
                    stock_in_hand = $4
                WHERE material_id = $5;`,
        values: [materialName, description, isProtected, stockInHand, materialId],
    };
    const deleteExistingCategories = {
        text: `DELETE FROM material_categories
                WHERE material_id = $1`,
        values: [materialId],
    };

    const client = await db.getClient();
    try {
        await client.query('BEGIN');
        const editResult = await client.query(editMaterialSQL);
        if (editResult.rowCount === 0) {
            throw new Error('Failed to edit material');
        }
        await client.query(deleteExistingCategories);

        if (categories.length > 0) {
            const uniqueCategoryIds = [...new Set(categories)];
            const editMaterialCategories = {
                text: `INSERT INTO material_categories (material_id, category_id)
                        SELECT $1, c.category_id 
                        FROM categories c
                        JOIN category_map cm
                            ON c.category_for = cm.cat_map_id
                        WHERE cm.cat_mapped_to = 'Material'
                            AND c.category_id = ANY($2::int[]);
                        `,
                values: [materialId, uniqueCategoryIds],
            };
            const categoryResult = await client.query(editMaterialCategories);
            if (categoryResult.rowCount !== uniqueCategoryIds.length) {
                throw new Error('Failed to edit material category');
            }
        }
        await client.query('COMMIT');
    } catch(err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        await client.release();
    }
}

module.exports = {
    getAllMaterials,
    getMaterialCategories,
    addMaterial,
    getMaterialProtectStatus,
    getMaterialById,
    editMaterial,
};