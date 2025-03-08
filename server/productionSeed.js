const fs = require('fs');
const csv = require('csv-parser');
const Product = require('./models/Product');
const mongoose = require('mongoose');
const { connectToDB } = require('./database/db'); 
require('dotenv').config();  // Correct path based on your structure

const seedProducts = async () => {
    try {
        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        const products = [];

        // Read CSV file
        await new Promise((resolve, reject) => {
            fs.createReadStream('productdata.csv')
                .pipe(csv())
                .on('data', (row) => {
                    // Map CSV columns to product schema
                    const product = {
                        name: row.name,
                        brand: row.brand,
                        price: parseFloat(row.price),
                        rating: parseFloat(row.rating) || 0,
                        reviews: parseInt(row.reviews) || 0,
                        link: row.link,
                        search_query: row.searchQuery, // Adjusted field to match schema
                        image_url: row.imageUrl, // Adjusted field to match schema
                        description: row.description,
                        availability: parseInt(row.availability) || 0,  // Ensure it is a number (stock count)
                        loyaltypoints: parseInt(row.loyaltyPoints) || 0 // Adjusted field to match schema
                    };
                    products.push(product);
                })
                .on('end', () => {
                    console.log(`Parsed ${products.length} products from CSV`);
                    resolve();
                })
                .on('error', reject);
        });

        // Insert products into database
        await Product.insertMany(products);
        console.log('Successfully seeded products');

    } catch (error) {
        console.error('Error seeding products:', error.message);
    } finally {
        // Close database connection after seeding
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the seeding process
connectToDB().then(() => {
    seedProducts();
});
