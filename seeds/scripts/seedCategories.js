require('dotenv').config();
const { Client } = require('pg');
const dbConnectionString = process.argv.length > 2 ? process.argv[2] : process.env.DB_URL;

const { categoryData } = require('../data/categories');

const categoryType = `
INSERT INTO category_map (cat_mapped_to)
VALUES ($1)
`;

const productCategories = `
INSERT INTO categories (category_name, category_for, is_protected)
SELECT $1, cat_map_id, true
FROM category_map
WHERE cat_mapped_to='Product'
`;

const materialCategories = `
INSERT INTO categories (category_name, category_for, is_protected)
SELECT $1, cat_map_id, true
FROM category_map
WHERE cat_mapped_to='Material'
`;

async function main() {
    const client = new Client(dbConnectionString);
    await client.connect();
    try {
        console.log("Start Seeding....");
        await client.query('BEGIN');
        
        for (const value of categoryData.categoryTypes) {
            await client.query({name: "category_type", text: categoryType, values: [value]});
        }
        for (const value of categoryData.categories.product) {
            await client.query({ name: "product_category", text: productCategories, values: [value] });
        }
        for (const value of categoryData.categories.material) {
            await client.query({ name: "material_category", text: materialCategories, values: [value] });
        }
        await client.query('COMMIT');
        console.log("Done");
    } catch (error) {
        client.query('ROLLBACK');
        console.error(error)
    } finally {
        await client.end();
    }
}

main();