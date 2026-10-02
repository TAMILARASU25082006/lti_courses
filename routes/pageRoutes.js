const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const { body } = require('express-validator');

router.get('/', pageController.getHomePage);
router.get('/about', pageController.getAboutPage);
router.get('/contact', pageController.getContactPage);

router.post(
  '/contact',
  [
    body('name').trim().notEmpty().withMessage('Please enter your name'),
    body('email').trim().isEmail().withMessage('Please enter a valid email address'),
    body('message').trim().notEmpty().withMessage('Please enter your message')
  ],
  pageController.postContactMessage
);

module.exports = router;
