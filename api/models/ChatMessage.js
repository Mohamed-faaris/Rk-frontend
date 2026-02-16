import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['general', 'support', 'sales', 'feedback', 'other'],
    default: 'general'
  },
  resolved: {
    type: Boolean,
    default: false
  },
  adminNotes: {
    type: String,
    default: ''
  },
  sessionId: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Index for faster queries
ChatMessageSchema.index({ userId: 1, timestamp: -1 });
ChatMessageSchema.index({ sessionId: 1 });
ChatMessageSchema.index({ isRead: 1 });
ChatMessageSchema.index({ resolved: 1 });

export default mongoose.model('ChatMessage', ChatMessageSchema);
