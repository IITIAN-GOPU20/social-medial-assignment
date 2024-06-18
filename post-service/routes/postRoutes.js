import express from 'express';
import { createPost, getPosts, getPostsByTag, updatePost, deletePost, likeUnlikePost, uploadImage, getAllCommentsForPost } from '../controllers/postController.js';
import { protectRoute } from "common"

const router = express.Router();

router.post('/', protectRoute, uploadImage, createPost);
router.get('/', protectRoute, getPosts);
router.get('/tags', protectRoute, getPostsByTag);
router.put('/:id', protectRoute, uploadImage, updatePost);
router.delete('/:id', protectRoute, deletePost);
router.post('/like/:id', protectRoute, likeUnlikePost);
router.get('/:postId/comments', protectRoute, getAllCommentsForPost);

export default router;