import express from "express";

import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import multer   from 'multer';

import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import { connectDB } from 'common';


const app = express();


connectDB();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
	console.log(`Post Service received request: ${req.method} ${req.originalUrl}`);
	next();
  });
//Routes
app.use('', postRoutes);
app.use('/comments', commentRoutes);

export default app;
