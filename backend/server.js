import express from 'express';
import db from './config/db.js'
import dotenv from 'dotenv';
dotenv.config();
import User from './models/user.model.js';
import Book from './models/book.model.js'
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET
})

const app= express();
const PORT = process.env.PORT;
console.log('Port is',PORT)
app.use(express.json({limit:"20mb"}))
app.use(cors({
  origin:"https://booklibrary1-h0cq.onrender.com",
  credentials:true
}))
app.use(cookieParser());

const __dirname = path.resolve()





app.post('/api/signup', async(req,res)=>{
  const {username,email,password}= req.body;
  try {
    if(!username || !email || !password){
      throw new Error("All fields are required.")
    }
    const emailExists = await User.findOne({email})
    if(emailExists){
      return res.status(400).json({message: "User already exists."})
    }
    const usernameExists = await User.findOne({username});
    if(usernameExists){
      return res
      .status(400)
      .json({message: "Username is taken, try another name."})
    }
    const hashedPassword = await bcryptjs.hash(password,10);
    const userDoc = await User.create({
      username,
      email,
      password:hashedPassword
    });
    if (userDoc){
       const token = jwt.sign({id:userDoc._id},process.env.JWT_SECRET,{expiresIn:"7d"})
      res.cookie('token',token,{
      httpOnly:true,
      secure: process.env.NODE_ENV==='production',
      sameSite: 'strict',
      maxAge: 7*24*60*60*1000})
    }
    return res.status(200).json({user:userDoc,message:"user created successfully"})
   
  } catch (error) {
    res.status(400).json({message:error.message})
  }
})

app.post('/api/login',async(req,res)=>{
  const {username, password} =req.body;
  try {
    const userDoc = await User.findOne({username});
    if(!userDoc){
      return res.status(400).json({message:"Invalid credentials"})
      
    }
    const isPasswordValid = bcryptjs.compareSync(password,userDoc.password);
    if(!isPasswordValid){
      return res.status(400).json({message:"Invalid credentials"})
    }
    if(userDoc){
    const token = jwt.sign({id:userDoc._id},process.env.JWT_SECRET,{expiresIn:"7d"})
     res.cookie('token',token,{
      httpOnly:true,
      secure:process.env.NODE_ENV==="production",
      sameSite:"strict",
      maxAge: 7*24*60*60*1000,
     })
    }
    res.status(200).json({
      message:"Logged in successfully",
      user:userDoc
    })
  } catch (error) {
    console.log("Error logging in",error)
    res.status(400).json({message: error.message})
  }
})

app.get('/api/fetch-user',async(req,res)=>{
  const {token} =req.cookies;
  if (!token){
    return res.status(401).json({message: "No token provided"})
  }
  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({message:"Invalid token"})
    }
    const userDoc = await User.findById(decoded.id).select("-password");
    if (!userDoc){
      return res.status(400).json({message: "User not found."})
    }
    res.status(200).json({
      user:userDoc,
    })
  }catch(error){
  console.log("Error in fetching user",error);
  res.status(400).json({message:error.message})
}
} )

app.post('/api/logout',async(req,res)=>{
  res.clearCookie('token');
  res.status(200).json({message: "Logged out sucessfully."})
})

app.post('/api/add-book',async(req,res)=>{
  const {token} =req.cookies;
  if(!token){
    return res.status(401).json({message:'No Token provided'})
  }
  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    if(!decoded){
      return res.status(401).json({message:"Invalid token"})
    }
    const userDoc =await User.findById(decoded.id).select("-password");
    const {image,title,subtitle,author,link,review} =req.body;
    const imageResponse = await cloudinary.uploader.upload(image)
    const book = await Book.create({
      image:imageResponse.secure_url,
      title,
      subtitle,
      author,
      link,
      review,
      user:userDoc,
    })
    return res.status(200).json({message:'book added successfuly',book})
  } catch (error) {
    res.status(400).json({message:error.message})
  }
})

app.get('/api/fetch-books', async(req,res)=>{
  try {
    const books = await Book.find().sort({createdAt:-1})
    return res.status(200).json({books})
  } catch (error) {
    res.status(400).json({message:error.message})
  }
})

app.get('/api/fetch-book/:id',async(req,res)=>{
  try{
    const {id}=req.params
    const book = await Book.findById(id).populate("user",["username"])
    res.status(200).json({book});
  }catch(error){
    res.status(400).json({message:error.message})
  }
})
app.post('/api/update-book/:id', async(req,res)=>{
  const {image,title,subtitle,author,link,review}=req.body;
  const {token} = req.cookies;
  if(!token){
    return res.status(401).json({message: "No token provided"})
  }
  const {id}= req.params
  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    if(!decoded){
      return res.status(401).json({message: "Invalid token"})
      
    }
    const book = await Book.findById(id)
    if (image){
      const parts =book.image.split('/');
      const fileName = parts[parts.length -1];
      const imageId =fileName.split('.')[0];
      cloudinary.uploader
        .destroy(`Favlib/${imageId}`)
        .then((result)=>console.log("result: ",result));

      const imageResponse = await cloudinary.uploader.upload(image,{
        folder:'/Favlib'
      })
      const updatedBook = await Book.findByIdAndUpdate(id,{
        image:imageResponse.secure_url,
        title,
        subtitle,
        author,
        link,
        review
      })
      return res.status(200).json({message:"Book updated Successfully.",book:updatedBook})
    }
    const updatedBook = await Book.findByIdAndUpdate(id,{
      title,
      subtitle,
      author,
      link,
      review
    })
    return res.status(200).json({message:'Book updated successfully',book})
  } catch (error) {
    console.log(error.message);
    res.status(400).json({message:error.message})
  }
})

app.delete('/api/delete-book/:id',async(req,res)=>{
  const {id} =req.params;
  const {token} =req.cookies;
  if(!token){
    return res.status(401).json({message:"No token provided"})
  }
  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    if(!decoded){
      return res.status(401).json({message:"Invalid token"})
    }
    const book = await Book.findById(id);
    const parts = book.image.split('/')
    const fileName = parts[parts.length-1];
    const imageId= fileName.split('.')[0];
    cloudinary.uploader
    .destroy(imageId)
    .then((result)=>console.log("result: ",result))

    await Book.findByIdAndDelete(id);
    return res.status(200).json({message: "Book deleted successfully. "})
  } catch (error) {
    console.log(error.message)
    res.status(400).json({message:error.message})
  }
})

app.get('/api/search',async (req,res)=>{
   try {
    const searchTerm = req.query.searchTerm?.trim() || "";
    const books = await Book.find({
      title: { $regex: searchTerm, $options: "i" }
    }).sort({ createdAt: -1 });

    res.status(200).json({ books }); // ✅ send the result
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

})

if(process.env.NODE_ENV==='production'){
  
  app.use(express.static(path.join(__dirname, '/frontend/build')));
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'frontend','build','index.html'))
  })
}



const startServer = async () => {
  await db();
  app.listen(5000, () => console.log(`Server is running...http://localhost:${PORT || 5000}`));
};
startServer();
