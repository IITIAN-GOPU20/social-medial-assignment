import { Post } from 'common';
import { v2 as cloudinary } from "cloudinary";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({ storage });
export const uploadImage = upload.single('image');

export const createPost = async (req, res) => {
    const { text, hashtags } = req.body;
    let image = req.file ? req.file.path : null;
    let filePath = null;

    if (!text) {
        return res.status(400).json({ error: " text fields are required" });
    }
    try {
        if (image) {
            const uploadedResponse = await cloudinary.uploader.upload(image);
            image = uploadedResponse.secure_url;
            filePath = req.file.path;
        }
        const newPost = new Post({
            text,
            image,
            filePath,
            hashtags: hashtags ? hashtags.split(',').map(tag => tag.trim()) : [],
            author: req.user._id
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'name').populate('comments');
        res.json(posts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getPostsByTag = async (req, res) => {
    const tags = req.query.tags;
    if (!tags) {
        return res.status(400).json({ error: 'Tags parameter is required' });
    }
 
    const tagsArray = tags.split(',')
                          .map(tag => tag.trim())
                          .map(tag => tag.startsWith('#') ? tag : `#${tag}`);

    try {
        const posts = await Post.find({ hashtags: { $in: tagsArray } }).populate('author', 'name').populate('comments');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { text, hashtags } = req.body;
    console.log("🚀 ~ updatePost ~ text:", text, id, req.body)
    let newImage = req.file ? req.file.path : null;
    try {
        const postToUpdate = await Post.findById(id);
        if (!postToUpdate) {
            return res.status(404).json({ error: "Post not found" });
        }
        if (text) postToUpdate.text = text;
        if (hashtags) {
            postToUpdate.hashtags = hashtags.split(',').map(tag => tag.trim());
        }
        if (newImage) {
            if (postToUpdate.image) {
                const deleteResponse = await cloudinary.uploader.destroy(postToUpdate.image);
            }
            const uploadedResponse = await cloudinary.uploader.upload(newImage);
            postToUpdate.image = uploadedResponse.secure_url;
        }
        await postToUpdate.save();
        res.status(200).json(postToUpdate);
    } catch (error) {
        console.error("Error in updatePost:", error);
        res.status(500).json({ error: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found.' });
        if (post.image) {
            const imgId = post.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
        if (post.filePath) {
            const filePath = path.join(__dirname, post.filePath);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${filePath}`, err);
                } else {
                    console.log(`File ${filePath} deleted.`);
                }
            });
        }
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const likeUnlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found.' });

        if (post.likes.includes(req.user._id)) {
            await Post.updateOne({ _id: post._id }, { $pull: { likes: req.user._id } });
            res.status(200).json({ message: "Post unliked successfully" });
            res.json({ message: 'Liked successfully.' });
        } else {
            post.likes.push(req.user._id);
            await post.save();
            res.status(200).json({ message: "Post liked successfully" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllCommentsForPost = async (req, res) => {
    const { postId } = req.params;
    
    try {
        const post = await Post.findById(postId).populate({
            path: 'comments',
            populate: {
                path: 'author',  
                select: 'name email' 
            }
        });
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(post.comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

