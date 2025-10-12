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

module.exports = {
    getAllMaterials,
}