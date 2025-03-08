const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data'); // Install this package: npm install form-data

// MongoDB connection URI
const uri = 'mongodb+srv://mihirpatil885:My1Bx9XRyLQibLAT@userdetails.vtcq0.mongodb.net/?retryWrites=true&w=majority&appName=UserDetails';
const dbName = 'test';
const collectionName = 'products';

// Function to send image and get keywords
async function getKeywordsFromImage(imagePath) {
  const fetch = await import('node-fetch'); // Dynamic import
  
  // Create a form-data instance
  const formData = new FormData();
  
  // Check if the file exists
  if (!fs.existsSync(imagePath)) {
    console.error(`File not found: ${imagePath}`);
    return null;
  }
  
  // Append the file to the form data
  formData.append('image', fs.createReadStream(imagePath));
  
  console.log('Image Path:', imagePath); // Log the image path
  
  try {
    const response = await fetch.default('http://10.120.133.75:3000/', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(), // Important for multipart/form-data
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      return null;
    }
    
    const data = await response.json();
    console.log('Server response:', data);
    return data.keywords;
  } catch (error) {
    console.error('Failed to process image:', error.message);
    return null;
  }
}

// Search function
async function searchInDatabase(query) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const results = await collection.find(query).toArray();
    console.log('Search Results:', results);
    return results;
  } catch (error) {
    console.error('Error searching in database:', error);
    return [];
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

// Example usage
async function main() {
  // Use absolute path to ensure the file is found
  const imagePath = path.resolve(__dirname, '61cwywLZR-L._SX679_.jpg');
  console.log('Absolute image path:', imagePath);
  
  const keywords = await getKeywordsFromImage(imagePath);

  if (keywords && keywords.length > 0) {
    console.log('Keywords found:', keywords);
    // Construct a regex query for the description field
    const searchQuery = { description: { $regex: new RegExp(keywords.join('|'), 'i') } };
    await searchInDatabase(searchQuery);
  } else {
    console.log('No keywords found or error occurred');
  }
}

main();