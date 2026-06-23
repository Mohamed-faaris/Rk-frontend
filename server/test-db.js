import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://rkh1_db_user:Rkh200903@cluster0.d8mozn4.mongodb.net/';

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection error:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
