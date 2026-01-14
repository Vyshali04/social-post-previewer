import express from 'express';
import Post from '../models/Post.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { user: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'username email');

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error while fetching posts' });
  }
});

// @route   GET /api/posts/stats
// @desc    Get user's post statistics

router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Post.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalPosts = await Post.countDocuments({ user: req.user._id });
    const platformStats = await Post.aggregate([
      { $match: { user: req.user._id } },
      { $unwind: '$platforms' },
      {
        $group: {
          _id: '$platforms',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalPosts,
      statusBreakdown: stats,
      platformBreakdown: platformStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error while fetching stats' });
  }
});


// @route   GET /api/posts/:id
// @desc    Get a single post by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).populate('user', 'username email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error while fetching post' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { originalContent, aiGeneratedContent, tone, platforms, tags, media, status } = req.body;

    if (!originalContent || !platforms || platforms.length === 0) {
      return res.status(400).json({
        message: 'Original content and at least one platform are required'
      });
    }

    const post = new Post({
      user: req.user._id,
      originalContent,
      aiGeneratedContent: aiGeneratedContent || '',
      tone: tone || null,  // ✅ Include tone field
      platforms,
      tags: tags || [],
      media: media || '',
      status: status || 'draft'
    });

    await post.save();
    await post.populate('user', 'username email');

    res.status(201).json({
      message: status === 'published'
        ? 'Post published successfully'
        : 'Draft saved successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error while creating post' });
  }
});


// @route   PUT /api/posts/:id
// @desc    Update a post
router.put('/:id', auth, async (req, res) => {
  try {
    const { originalContent, aiGeneratedContent, tone, platforms, tags, media, status } = req.body;

    const post = await Post.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Update fields
    if (originalContent !== undefined) post.originalContent = originalContent;
    if (aiGeneratedContent !== undefined) post.aiGeneratedContent = aiGeneratedContent;
    if (tone !== undefined) post.tone = tone;
    if (platforms !== undefined) post.platforms = platforms;
    if (tags !== undefined) post.tags = tags;
    if (media !== undefined) post.media = media;
    if (status !== undefined) post.status = status;

    await post.save();
    await post.populate('user', 'username email');

    res.json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error while updating post' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await Post.deleteOne({ _id: req.params.id });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error while deleting post' });
  }
});



export default router;
