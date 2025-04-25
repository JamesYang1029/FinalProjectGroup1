// data/users.js
import bcrypt from 'bcrypt';
import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

// Registers a new user after validating inputs and hashing password.
 
export async function registerUser(username, password) {
  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    throw new Error('Username must be at least 3 characters.');
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  const userCol = await users();
  const normalized = username.trim().toLowerCase();
  const existing = await userCol.findOne({ username: normalized });
  if (existing) {
    throw new Error('Username already exists.');
  }

  const hashed = await bcrypt.hash(password, 10);
  const result = await userCol.insertOne({ username: normalized, password: hashed, watchlist: [] });
  return { _id: result.insertedId, username: normalized };
}

// Authenticates a user by comparing credentials.

export async function loginUser(username, password) {
  if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
    throw new Error('Invalid credentials.');
  }

  const userCol = await users();
  const normalized = username.trim().toLowerCase();
  const user = await userCol.findOne({ username: normalized });
  if (!user) {
    throw new Error('Invalid credentials.');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error('Invalid credentials.');
  }

  return { _id: user._id, username: user.username };
}
