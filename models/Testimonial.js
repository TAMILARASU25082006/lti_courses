const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  role: {
    type: String,
    default: 'LTI Student Intern'
  },
  courseName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: [true, 'Testimonial content is required']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  avatar: {
    type: String,
    default: '/images/default-avatar.png'
  },
  published: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
