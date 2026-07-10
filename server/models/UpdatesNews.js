import mongoose from 'mongoose';

const updatesNewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 180
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 3000
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true
    },
    imageAlt: {
      type: String,
      trim: true,
      maxlength: 180,
      default: 'Updates and news image'
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    publishedAt: {
      type: Date,
      default: Date.now
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
    }
  },
  {
    timestamps: true
  }
);

updatesNewsSchema.index({ publishedAt: -1, createdAt: -1 });

export default mongoose.model('UpdatesNews', updatesNewsSchema);