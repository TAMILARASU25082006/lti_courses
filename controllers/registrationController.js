const Registration = require('../models/Registration');
const Course = require('../models/Course');
const { validationResult } = require('express-validator');

exports.getRegisterPage = async (req, res) => {
  try {
    const courses = await Course.find({ active: true });
    const selectedCourseQuery = req.query.course || '';
    const selectedLevelQuery = req.query.level || '';

    res.render('pages/register', {
      title: 'Course Registration | LTI_COURSES',
      courses,
      selectedCourseQuery,
      selectedLevelQuery
    });
  } catch (error) {
    console.error('Register Page Error:', error);
    res.status(500).render('pages/error', { message: 'Server error loading registration page' });
  }
};

exports.postRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const courses = await Course.find({ active: true });
    return res.status(400).render('pages/register', {
      title: 'Course Registration | LTI_COURSES',
      courses,
      selectedCourseQuery: req.body.selectedCourse || '',
      selectedLevelQuery: req.body.roboticsLevel || '',
      errorMsg: errors.array()[0].msg,
      formData: req.body
    });
  }

  try {
    const {
      fullName,
      email,
      mobile,
      schoolCollege,
      qualification,
      selectedCourse,
      roboticsLevel,
      preferredMode,
      message,
      registrationType
    } = req.body;

    // Check for duplicate pending/approved registration for same email & course
    const existingReg = await Registration.findOne({
      email: email.toLowerCase(),
      selectedCourse,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingReg) {
      const courses = await Course.find({ active: true });
      return res.status(400).render('pages/register', {
        title: 'Course Registration | LTI_COURSES',
        courses,
        selectedCourseQuery: selectedCourse,
        selectedLevelQuery: roboticsLevel || '',
        errorMsg: `An active registration for ${email} under "${selectedCourse}" already exists. Check your profile or contact us.`,
        formData: req.body
      });
    }

    const registration = await Registration.create({
      fullName,
      email: email.toLowerCase(),
      mobile,
      schoolCollege,
      qualification,
      selectedCourse,
      roboticsLevel: selectedCourse.includes('Robotics') ? (roboticsLevel || 'Level 1 – SENSOR ROBOTICS') : 'N/A',
      preferredMode: preferredMode || 'Offline Classroom',
      message: message || '',
      registrationType: registrationType || 'website',
      userId: (req.session && req.session.user) ? req.session.user._id : null
    });

    res.render('pages/register-success', {
      title: 'Registration Submitted Successfully | LTI_COURSES',
      registration
    });
  } catch (error) {
    console.error('Registration Submit Error:', error);
    const courses = await Course.find({ active: true });
    res.status(500).render('pages/register', {
      title: 'Course Registration | LTI_COURSES',
      courses,
      selectedCourseQuery: req.body.selectedCourse || '',
      selectedLevelQuery: req.body.roboticsLevel || '',
      errorMsg: 'Server error processing registration. Please try again.',
      formData: req.body
    });
  }
};
