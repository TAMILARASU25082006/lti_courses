const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { body } = require('express-validator');

router.get('/register', registrationController.getRegisterPage);

router.post(
  '/register',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').trim().isEmail().withMessage('Please provide a valid email address'),
    body('mobile')
      .trim()
      .matches(/^[0-9]{10}$/)
      .withMessage('Mobile number must be a valid 10-digit phone number'),
    body('schoolCollege').trim().notEmpty().withMessage('School / College name is required'),
    body('qualification').trim().notEmpty().withMessage('Qualification / Standard is required'),
    body('selectedCourse').trim().notEmpty().withMessage('Please select a course')
  ],
  registrationController.postRegister
);

module.exports = router;
