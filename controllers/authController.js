const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.getSignupPage = (req, res) => {
  if (req.session.user) return res.redirect('/profile');
  res.render('pages/signup', {
    title: 'Student Registration & Signup | LTI_COURSES'
  });
};

exports.postSignup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('pages/signup', {
      title: 'Student Registration & Signup | LTI_COURSES',
      errorMsg: errors.array()[0].msg,
      formData: req.body
    });
  }

  try {
    const { fullName, email, password, mobile, schoolCollege, qualification, adminKey } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).render('pages/signup', {
        title: 'Student Registration & Signup | LTI_COURSES',
        errorMsg: 'An account with this email address already exists. Please login instead.',
        formData: req.body
      });
    }

    // Role selection: Check if optional admin key matches environment secret
    let role = 'student';
    if (adminKey && adminKey === (process.env.ADMIN_KEY || 'LTI_ADMIN_SECRET_2026')) {
      role = 'admin';
    }

    const newUser = await User.create({
      fullName,
      email: email.toLowerCase(),
      password,
      mobile,
      schoolCollege,
      qualification,
      role
    });

    // Save session
    req.session.user = {
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      profileImage: newUser.profileImage
    };

    req.session.successMsg = `Welcome to LTI, ${newUser.fullName}! Your account has been created successfully.`;
    return res.redirect(role === 'admin' ? '/admin' : '/profile');
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).render('pages/signup', {
      title: 'Student Registration & Signup | LTI_COURSES',
      errorMsg: 'Failed to create account. Please try again.',
      formData: req.body
    });
  }
};

exports.getLoginPage = (req, res) => {
  if (req.session.user) {
    return res.redirect(req.session.user.role === 'admin' ? '/admin' : '/profile');
  }
  res.render('pages/login', {
    title: 'Student Login | LTI_COURSES'
  });
};

exports.postLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('pages/login', {
      title: 'Student Login | LTI_COURSES',
      errorMsg: errors.array()[0].msg,
      formData: req.body
    });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).render('pages/login', {
        title: 'Student Login | LTI_COURSES',
        errorMsg: 'Invalid email address or password.',
        formData: req.body
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).render('pages/login', {
        title: 'Student Login | LTI_COURSES',
        errorMsg: 'Invalid email address or password.',
        formData: req.body
      });
    }

    // Set session
    req.session.user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage
    };

    req.session.successMsg = `Welcome back, ${user.fullName}!`;
    return res.redirect(user.role === 'admin' ? '/admin' : '/profile');
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).render('pages/login', {
      title: 'Student Login | LTI_COURSES',
      errorMsg: 'Server error logging in. Please try again.',
      formData: req.body
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Logout Session Destroy Error:', err);
    res.redirect('/');
  });
};
