import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'ID Card Designs',
      'Logo Design',
      'Printing Designs',
      'Advertisement Designs',
      'Social Media Designs',
      'Video Editing',
      'Photoshop Services',
      'Branding Designs',
      'Website Design',
      'Website Development',
      'E-Commerce Development',
      'Web Maintenance',
      'Software Development',
      'Other Tech Services',
      'UI/UX Design',
      '3D Animation',
      'Other'
    ]
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  link: String,
  technologies: [String],
  featured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Portfolio', portfolioSchema);
