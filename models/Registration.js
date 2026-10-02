const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  schoolCollege: {
    type: String,
    required: [true, 'School or College name is required'],
    trim: true
  },
  qualification: {
    type: String,
    required: [true, 'Qualification / Standard is required'],
    trim: true
  },
  selectedCourse: {
    type: String,
    required: [true, 'Selected course is required'],
    trim: true
  },
  roboticsLevel: {
    type: String,
    default: 'N/A'
  },
  preferredMode: {
    type: String,
    enum: ['Offline Classroom', 'Online Live', 'Hybrid'],
    default: 'Offline Classroom'
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  registrationType: {
    type: String,
    enum: ['website', 'google_forms'],
    default: 'website'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Registration', registrationSchema);
