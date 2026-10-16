const Course = require('../models/Course');
const mongoose = require('mongoose');

exports.getCoursesPage = async (req, res) => {
  try {
    const courses = (mongoose.connection.readyState === 1) ? await Course.find({ active: true }) : [];
    
    // Group courses by category for convenience
    const roboticsCourse = courses.find(c => c.category === 'robotics') || null;
    const fullstackCourse = courses.find(c => c.category === 'fullstack') || null;
    const uiuxCourse = courses.find(c => c.category === 'uiux') || null;

    res.render('pages/courses', {
      title: 'Our Courses | LTI – Robotics, Full Stack & UI/UX',
      roboticsCourse,
      fullstackCourse,
      uiuxCourse,
      courses
    });
  } catch (error) {
    console.error('Courses Page Error:', error);
    res.render('pages/courses', {
      title: 'Our Courses | LTI – Robotics, Full Stack & UI/UX',
      roboticsCourse: null,
      fullstackCourse: null,
      uiuxCourse: null,
      courses: []
    });
  }
};

exports.getCourseDetailPage = async (req, res) => {
  try {
    const { slug } = req.params;
    const course = (mongoose.connection.readyState === 1) ? await Course.findOne({ slug, active: true }) : null;
    if (!course) {
      req.session.errorMsg = 'Requested course not found.';
      return res.redirect('/courses');
    }

    res.render('pages/course-detail', {
      title: `${course.title} | LTI Courses`,
      course
    });
  } catch (error) {
    console.error('Course Detail Error:', error);
    res.status(500).render('pages/error', { message: 'Server error loading course details' });
  }
};
