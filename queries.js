// queries.js - Script to run different MongoDB queries

// Import MongoDB client
const { MongoClient } = require('mongodb');

// Connection URI (replace with your MongoDB connection string if using Atlas)
const uri = 'mongodb://localhost:27017';

// Database and collection names
const dbName = 'plp_bookstore';
const collectionName = 'books';

// Async function to run various queries
async function runQueries() {
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB server');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    console.log('\n=== MongoDB Queries ===\n');

    // 1️⃣ Find all books
    const allBooks = await collection.find({}).toArray();
    console.log('1. All books:');
    console.table(allBooks.map(b => ({ Title: b.title, Author: b.author, Year: b.published_year })));

    // 2️⃣ Find books by a specific author
    const orwellBooks = await collection.find({ author: 'George Orwell' }).toArray();
    console.log('\n2. Books by George Orwell:');
    console.table(orwellBooks.map(b => ({ Title: b.title, Year: b.published_year })));

    // 3️⃣ Find books published after 1950
    const modernBooks = await collection.find({ published_year: { $gt: 1950 } }).toArray();
    console.log('\n3. Books published after 1950:');
    console.table(modernBooks.map(b => ({ Title: b.title, Year: b.published_year })));

    // 4️⃣ Find books that are in stock
    const availableBooks = await collection.find({ in_stock: true }).toArray();
    console.log('\n4. Books currently in stock:');
    console.table(availableBooks.map(b => ({ Title: b.title, Price: b.price })));

    // 5️⃣ Find all Fantasy books
    const fantasyBooks = await collection.find({ genre: 'Fantasy' }).toArray();
    console.log('\n5. Fantasy books:');
    console.table(fantasyBooks.map(b => ({ Title: b.title, Author: b.author })));

    // 6️⃣ Update the price of one book
    const updateResult = await collection.updateOne(
      { title: '1984' },
      { $set: { price: 12.5 } }
    );
    console.log(`\n6. Updated ${updateResult.modifiedCount} book(s) price for '1984'`);

    // 7️⃣ Delete books that are out of stock
    const deleteResult = await collection.deleteMany({ in_stock: false });
    console.log(`\n7. Deleted ${deleteResult.deletedCount} out-of-stock book(s)`);

    // 8️⃣ Count total number of books in collection
    const totalBooks = await collection.countDocuments();
    console.log(`\n8. Total number of books after updates: ${totalBooks}`);

    // 9️⃣ Sort books by published year (newest first)
    const sortedBooks = await collection.find({}).sort({ published_year: -1 }).toArray();
    console.log('\n9. Books sorted by year (newest first):');
    console.table(sortedBooks.map(b => ({ Title: b.title, Year: b.published_year })));

  } catch (err) {
    console.error('Error running queries:', err);
  } finally {
    await client.close();
    console.log('\nConnection closed');
  }
}

// Run the queries
runQueries().catch(console.error);

