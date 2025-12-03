import mongoose from 'mongoose';
import env from './env';

export const connectDatabase = async (): Promise<void> => {
  if (!env.mongoUri) {
    throw new Error('Missing Mongo connection string');
  }

  mongoose.set('strictQuery', false);

  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000
  });

  console.log('MongoDB connected');
};

export default mongoose;

