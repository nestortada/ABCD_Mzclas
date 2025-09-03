import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectMongo() {
  if (!env.mongoUri) throw new Error('MONGO_URI is not set');
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri, {
    // options can be added here
  });
}
