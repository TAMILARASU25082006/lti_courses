const Course = require('../models/Course');

exports.getCoursesPage = async (req, res) => {
  try {
    const courses = await Course.find({ active: true });
    
    // Group courses by category for convenience
    const roboticsCourse = courses.find(c => c.category === 'robotics');
    const fullstackCourse = courses.find(c => c.category === 'fullstack');
    const uiuxCourse = courses.find(c => c.category === 'uiux');

    res.render('pages/courses', {
      title: 'Our Courses | LTI – Robotics, Full Stack & UI/UX',
      roboticsCourse,
      fullstackCourse,
      uiuxCourse,
      courses
    });
  } catch (error) {
    console.error('Courses Page Error:', error);
    res.status(500).render('pages/error', { message: 'Server error loading courses' });
  }
};

exports.getCourseDetailPage = async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug, active: true });
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
