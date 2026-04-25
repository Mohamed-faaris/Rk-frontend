import mongoose from 'mongoose';

const businessAnalyticsUpdateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 180
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    trim: true,
    maxlength: 400
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  metricsSnapshot: {
    totalOrders: {
      type: Number,
      default: 0
    },
    completedOrders: {
      type: Number,
      default: 0
    },
    todayRevenue: {
      type: Number,
      default: 0
    },
    weekRevenue: {
      type: Number,
      default: 0
    },
    monthRevenue: {
      type: Number,
      default: 0
    }
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    }
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

businessAnalyticsUpdateSchema.index({ publishedAt: -1 });

export default mongoose.model('BusinessAnalyticsUpdate', businessAnalyticsUpdateSchema);
