import { cryptoRatings, financialData } from '../config/mongoCollections.js';
import fs from 'fs';
import path from 'path';

// Function to upload and seed data from a JSON file
export async function uploadJsonFile(filePath) {
  try {
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8')); // Read the uploaded JSON file

    const cryptoRatingsCollection = await cryptoRatings();
    const financialDataCollection = await financialData();

    // Insert the data into the respective collections
    await cryptoRatingsCollection.insertMany(fileData.cryptoRatings);
    await financialDataCollection.insertMany(fileData.financialData);
  } catch (err) {
    throw new Error('Error uploading JSON file: ' + err.message);
  }
}

// Function to update the entire database by deleting old data and inserting new data
export async function updateEntireDatabase() {
  try {
    const cryptoRatingsCollection = await cryptoRatings();
    const financialDataCollection = await financialData();

    // Delete old data from both collections
    await cryptoRatingsCollection.deleteMany({});
    await financialDataCollection.deleteMany({});

    // Fetch the latest data (you can implement your data-fetching logic here)
    const latestData = await fetchLatestData();

    // Insert the fresh data into the collections
    await cryptoRatingsCollection.insertMany(latestData.cryptoRatings);
    await financialDataCollection.insertMany(latestData.financialData);
  } catch (err) {
    throw new Error('Error updating entire database: ' + err.message);
  }
}

// Function to perform an incremental update (only add/update new data since the last update)
export async function incrementalUpdate() {
  try {
    const lastUpdateTime = await getLastUpdateTimestamp();
    const newData = await fetchNewData(lastUpdateTime);

    if (newData.length > 0) {
      const cryptoRatingsCollection = await cryptoRatings();
      const financialDataCollection = await financialData();

      // Insert or update new data
      await cryptoRatingsCollection.insertMany(newData.cryptoRatings);
      await financialDataCollection.insertMany(newData.financialData);

      // Update the last update timestamp (to be implemented)
      await updateLastUpdateTimestamp();
    }
  } catch (err) {
    throw new Error('Error during incremental update: ' + err.message);
  }
}

// Example of a function that would fetch the latest data from external sources (CoinGecko, OpenAI, etc.)
async function fetchLatestData() {
  return {
    cryptoRatings: [],  // Replace with actual data from APIs
    financialData: []    // Replace with actual data from APIs
  };
}

// Example function to fetch new data since the last update
async function fetchNewData(lastUpdateTime) {
  return {
    cryptoRatings: [],  // Replace with actual new data based on last update timestamp
    financialData: []    // Replace with actual new data based on last update timestamp
  };
}

// Helper function to get the last update timestamp (could be stored in metadata)
async function getLastUpdateTimestamp() {
  return new Date('2025-03-01T00:00:00');  // Replace with actual timestamp logic
}

// Helper function to update the last update timestamp
async function updateLastUpdateTimestamp() {
  // Implement logic to update the last update timestamp in your metadata
}
