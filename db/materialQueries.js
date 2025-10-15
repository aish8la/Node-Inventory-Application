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

module.exports = {
    getAllMaterials,
    getMaterialCategories,
    addMaterial,
}