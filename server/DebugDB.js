const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = 'mongodb+srv://mihirpatil885:My1Bx9XRyLQibLAT@userdetails.vtcq0.mongodb.net/?retryWrites=true&w=majority&appName=UserDetails';
const dbName = 'test'; // Database name
const collectionName = 'products'; // Collection name

async function debugDatabase() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Fetch only one document to inspect its structure
        const sampleProduct = await collection.findOne({});

        if (sampleProduct) {
            console.log('🔍 Sample Product Document:', sampleProduct);
            console.log('📌 Available Fields:', Object.keys(sampleProduct));
        } else {
            console.log('⚠️ No products found in the database.');
        }
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
    } finally {
        await client.close();
        console.log('✅ MongoDB Connection Closed');
    }
}

// Run the debugging function
debugDatabase();
