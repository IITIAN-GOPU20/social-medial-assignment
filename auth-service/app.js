import express from "express";

import cookieParser from "cookie-parser";
import authRoutes  from './routes/authRoute.js';

import { connectDB } from 'common';


const app = express();


connectDB();

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('', authRoutes);


export default app;
