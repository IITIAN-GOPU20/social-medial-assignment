import express from 'express';
import { commentPost, likeComment, deleteComment, updateComment, postReply } from '../controllers/commentController.js';
import { protectRoute } from "common"

const router = express.Router();

router.post('/:id/comment', protectRoute, commentPost);
router.post('/comment/like/:commentId', protectRoute, likeComment);
router.delete('/comment/:commentId', protectRoute, deleteComment);
router.put('/comment/:commentId', protectRoute, updateComment);
router.post('/:commentId/replies', protectRoute, postReply);

export default router;
