const Course = require('../models/Course');
const Project = require('../models/Project');
const mongoose = require('mongoose');
const { defaultCourses, defaultProjects, normalizeSlug } = require('../utils/defaultData');

exports.getCoursesPage = async (req, res) => {
  try {
    let courses = [];
    if (mongoose.connection.readyState === 1) {
      courses = await Course.find({ active: true });
    }
    
    if (!courses || courses.length === 0) {
      courses = defaultCourses;
    }

    // Group courses by category for convenience
    const roboticsCourse = courses.find(c => c.category === 'robotics') || defaultCourses.find(c => c.category === 'robotics');
    const fullstackCourse = courses.find(c => c.category === 'fullstack') || defaultCourses.find(c => c.category === 'fullstack');
    const uiuxCourse = courses.find(c => c.category === 'uiux') || defaultCourses.find(c => c.category === 'uiux');

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
      roboticsCourse: defaultCourses.find(c => c.category === 'robotics'),
      fullstackCourse: defaultCourses.find(c => c.category === 'fullstack'),
      uiuxCourse: defaultCourses.find(c => c.category === 'uiux'),
      courses: defaultCourses
    });
  }
};

exports.getCourseDetailPage = async (req, res) => {
  try {
    const rawSlug = req.params.slug;
    const cleanSlug = normalizeSlug(rawSlug);

    let course = null;
    if (mongoose.connection.readyState === 1) {
      course = await Course.findOne({
        $or: [
          { slug: cleanSlug, active: true },
          { slug: rawSlug, active: true },
          { category: cleanSlug, active: true }
        ]
      });
    }

    // Bulletproof Fallback: If not found in DB or DB not connected, look up in defaultCourses
    if (!course) {
      course = defaultCourses.find(c => 
        c.slug === cleanSlug || 
        c.slug === rawSlug || 
        c.category === cleanSlug ||
        c.title.toLowerCase() === String(rawSlug).toLowerCase()
      );
    }

    if (!course) {
      req.session.errorMsg = 'Requested course not found.';
      return res.redirect('/courses');
    }

    let internProjects = [];
    if (course.category === 'fullstack') {
      if (mongoose.connection.readyState === 1) {
        internProjects = await Project.find({
          category: 'Full Stack Projects',
          status: 'published',
          liveUrl: { $ne: '' }
        }).sort({ createdAt: -1 });
      }
      if (!internProjects || internProjects.length === 0) {
        internProjects = defaultProjects.filter(p => p.category === 'Full Stack Projects' && p.liveUrl);
      }
    }

    res.render('pages/course-detail', {
      title: `${course.title} | LTI Courses`,
      course,
      internProjects
    });
  } catch (error) {
    console.error('Course Detail Error:', error);
    const cleanSlug = normalizeSlug(req.params.slug);
    const fallbackCourse = defaultCourses.find(c => c.slug === cleanSlug) || defaultCourses[0];
    res.render('pages/course-detail', {
      title: `${fallbackCourse.title} | LTI Courses`,
      course: fallbackCourse,
      internProjects: defaultProjects.filter(p => p.category === 'Full Stack Projects' && p.liveUrl)
    });
  }
};
