import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalContent: {
    type: String,
    required: [true, 'Original content is required'],
    maxlength: [1000, 'Content cannot exceed 1000 characters']
  },
  aiGeneratedContent: {
    type: String,
    maxlength: [1000, 'AI content cannot exceed 1000 characters']
  },
  tone: {
    type: String,
    enum: ['professional', 'funny', 'hype', null],
    default: null
  },
  platforms: [{
    type: String,
    enum: ['twitter', 'linkedin', 'instagram'],
    required: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  tags: [{
    type: String,
    trim: true
  }],
  media: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for better query performance
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ status: 1 });

export default mongoose.model('Post', postSchema);
