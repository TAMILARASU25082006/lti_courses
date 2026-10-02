const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Robotics Projects', 'Full Stack Projects', 'UI/UX Projects', 'Research & Development'],
    required: [true, 'Project category is required']
  },
  description: {
    type: String,
    required: [true, 'Project summary description is required']
  },
  detailedContent: {
    type: String,
    default: ''
  },
  technologies: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: '/images/default-project.jpg'
  },
  status: {
    type: String,
    enum: ['published', 'unpublished'],
    default: 'published'
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
