const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = 'mongodb+srv://mihirpatil885:My1Bx9XRyLQibLAT@userdetails.vtcq0.mongodb.net/?retryWrites=true&w=majority&appName=UserDetails';
const dbName = 'test';
const collectionName = 'products';

// Function to get keywords from text
async function getKeywordsFromText(searchText) {
  const fetch = await import('node-fetch'); // Dynamic import
  
  try {
    const response = await fetch.default('http://10.120.133.75:3000/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: searchText })
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
    console.error('Failed to process text:', error.message);
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
  const searchText = "I want to buy a refrigerator"; // Example search text
  console.log('Search text:', searchText);
  
  const keywords = await getKeywordsFromText(searchText);

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