export { default as User } from './models/User.js';
export { default as Post } from './models/Post.js';
export { default as Comment } from './models/Comment.js';

export { connectDB } from './config/connectDB.js';
export { generateTokenAndSetCookie } from './utils/generateTokenAndSetCookie.js';
export { protectRoute } from './middlewares/protectRoute.js';
