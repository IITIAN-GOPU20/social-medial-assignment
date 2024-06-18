import express from "express";
import {
    getUsers,
    getUser,
    updateUser,
    followUnFollowUser,
    deleteOwnAccount,
    searchUsers
} from "../controllers/userController.js";
import { protectRoute } from 'common';


const router = express.Router();

router.get('/search', protectRoute, searchUsers);
router.get('/', protectRoute, getUsers);
router.get('/:id', protectRoute, getUser);
router.put("/update/:id", protectRoute, updateUser);
router.delete('/me', protectRoute, deleteOwnAccount);
router.post("/follow/:id", protectRoute, followUnFollowUser);


export default router;
