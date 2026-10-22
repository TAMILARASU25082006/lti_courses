const Course = require('../models/Course');
const Project = require('../models/Project');

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

    let internProjects = [];
    if (course.category === 'fullstack') {
      internProjects = await Project.find({
        category: 'Full Stack Projects',
        status: 'published',
        liveUrl: { $ne: '' }
      }).sort({ createdAt: -1 });
    }

    res.render('pages/course-detail', {
      title: `${course.title} | LTI Courses`,
      course,
      internProjects
    });
  } catch (error) {
    console.error('Course Detail Error:', error);
    res.status(500).render('pages/error', { message: 'Server error loading course details' });
  }
};
