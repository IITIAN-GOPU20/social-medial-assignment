import { Post, Comment } from 'common';


export const commentPost = async (req, res) => {
  const { text } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });

    const comment = new Comment({ text, author: req.user._id });
    await comment.save();

    post.comments.push(comment._id);
    await post.save();

    res.json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found.' });

    if (!comment.likes.includes(req.user._id)) {
      comment.likes.push(req.user._id);
      await comment.save();
      res.json({ message: 'Liked comment successfully.' });
    } else {
      res.status(400).json({ error: 'You already liked this comment.' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found.' });

    await Post.updateOne({ 'comments': req.params.commentId }, { $pull: { 'comments': req.params.commentId } });

    res.json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.commentId, { text: req.body.text }, { new: true });
    if (!comment) return res.status(404).json({ error: 'Comment not found.' });
    res.json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const postReply = async (req, res) => {
  const { text } = req.body;
  const { commentId } = req.params;
  try {
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ error: 'Parent comment not found.' });
    }
    const reply = new Comment({
      text,
      author: req.user._id
    });
    await reply.save();
    parentComment.replies.push(reply._id);
    await parentComment.save();
    res.status(201).json(reply);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
