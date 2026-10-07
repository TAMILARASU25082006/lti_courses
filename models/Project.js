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
  has3DModel: {
    type: Boolean,
    default: false
  },
  model3DType: {
    type: String,
    enum: ['line-follower', 'obstacle-avoiding', 'edge-avoiding', 'wall-object-following', 'wireless-rc-car', 'rover', 'arm', 'biped'],
    default: 'line-follower'
  },
  studentAuthor: {
    type: String,
    default: ''
  },
  modelSpecs: {
    chassis: { type: String, default: 'Custom Acrylic & Aluminum Matrix' },
    microcontroller: { type: String, default: 'Arduino Uno R3 / ESP32' },
    sensors: { type: String, default: 'HC-SR04 Ultrasonic Sonar & IR Array' },
    motors: { type: String, default: '4x Dual Shaft TT Gear Motors with L298N Driver' },
    power: { type: String, default: '11.1V 3S LiPo Battery Pack' }
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
