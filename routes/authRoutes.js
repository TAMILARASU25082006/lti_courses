const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const { body } = require('express-validator');

// Normal Signup & Login
router.get('/signup', authController.getSignupPage);
router.post(
  '/signup',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').trim().isEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('mobile')
      .optional({ checkFalsy: true })
      .matches(/^[0-9]{10}$/)
      .withMessage('Mobile number must be 10 digits')
  ],
  authController.postSignup
);

router.get('/login', authController.getLoginPage);
router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Please enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  authController.postLogin
);

// Google OAuth 2.0 Routes
router.get('/auth/google', (req, res, next) => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  if (!clientID || clientID.trim() === '' || clientID === 'your_google_client_id_here') {
    req.session.errorMsg = 'Google OAuth credentials missing or unconfigured in .env file.';
    return res.redirect('/login');
  }
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })(req, res, next);
});

router.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err || !user) {
      console.error('[Google OAuth Error]:', err || info);
      req.session.errorMsg = 'Google Authentication failed or was cancelled. Please try again.';
      return res.redirect('/login');
    }

    // Log user into session
    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error('[Login Session Error]:', loginErr);
        req.session.errorMsg = 'Failed to establish session after Google authentication.';
        return res.redirect('/login');
      }

      req.session.user = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      };

      req.session.successMsg = `Welcome to LTI, ${user.fullName}! Successfully authenticated via Google.`;
      return res.redirect(user.role === 'admin' ? '/admin' : '/profile');
    });
  })(req, res, next);
});

router.all('/logout', authController.logout);

module.exports = router;
