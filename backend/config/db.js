import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const db = async()=>{
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('db connected')
  } catch(error){
    console.log(error)
    process.exit(1);
  };
  
}

export default db;