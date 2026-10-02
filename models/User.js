const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: function() { return !this.googleId; }, // Required only for normal email/password users
    minlength: [6, 'Password must be at least 6 characters']
  },
  googleId: {
    type: String,
    default: null
  },
  mobile: {
    type: String,
    trim: true
  },
  schoolCollege: {
    type: String,
    trim: true
  },
  qualification: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  profileImage: {
    type: String,
    default: '/images/default-avatar.png'
  },
  bio: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Hash password before save if modified
userSchema.pre('save', async function(next) {
  if (!this.password || !this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to check password validity
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
