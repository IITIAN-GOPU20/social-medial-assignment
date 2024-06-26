import express from "express";

import cookieParser from "cookie-parser";
import userRoutes  from './routes/userRoutes.js';

import { connectDB } from 'common';


const app = express();


connectDB();


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('', userRoutes);


export default app;
