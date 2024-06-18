
import { User, Comment, Post } from 'common';

import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('User not found.');
        res.status(200).json(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const updateUser = async (req, res) => {
    const { name, email, username, password, bio } = req.body;
    let { profilePic } = req.body;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user) return res.status(400).json({ error: "User not found" });

        if (req.params.id !== userId.toString()) {
            return res.status(400).json({ error: "You cannot update another user's profile" });
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        if (profilePic) {
            if (user.profilePic) {
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profilePic);
            user.profilePic = uploadedResponse.secure_url;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;

        user = await user.save();

        user.password = undefined;
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error("Error in updateUser: ", err);
    }
};


const followUnFollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);
        if (id === req.user._id.toString())
            return res.status(400).json({ error: "You cannot follow/unfollow yourself" });
        if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });
        const isFollowing = currentUser.following.includes(id);
        if (isFollowing) {
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            res.status(200).json({ message: "User followed successfully" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in followUnFollowUser: ", err.message);
    }
};

const deleteOwnAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).send('User not found.');
        await Post.deleteMany({ author: userId });
        await Comment.deleteMany({ author: userId });
        await Post.updateMany({ likes: userId }, { $pull: { likes: userId } });
        await Comment.updateMany({ likes: userId }, { $pull: { likes: userId } });
        res.cookie("jwt", "", { maxAge: 1 });
        res.status(500).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;


        if (!query) {
            return res.status(400).json({ error: 'Search query is required.' });
        }

        const searchQuery = new RegExp(query, 'i');
        const users = await User.find({
            $or: [
                { name: searchQuery },
                { username: searchQuery },
                { email: searchQuery }
            ]
        }).select('-password');

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("Error in searchUsers: ", error);
    }
};


export {
    getUser,
    getUsers,
    followUnFollowUser,
    updateUser,
    deleteOwnAccount,
    searchUsers,

};
