const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  levelNumber: { type: Number, required: true },
  title: { type: String, required: true },
  eligibility: { type: String, required: true },
  topics: [{ type: String }],
  description: { type: String }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  category: {
    type: String,
    enum: ['robotics', 'fullstack', 'uiux'],
    required: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  highlights: [{ type: String }],
  topics: [{ type: String }],
  eligibility: { type: String },
  levels: [levelSchema],
  duration: { type: String, default: 'Flexible' },
  image: { type: String, default: '/images/default-course.jpg' },
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
