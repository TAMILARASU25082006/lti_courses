const User = require('../models/User');
const Registration = require('../models/Registration');
const Course = require('../models/Course');
const Project = require('../models/Project');
const ContactMessage = require('../models/ContactMessage');
const Testimonial = require('../models/Testimonial');

// 1. Dashboard Overview
exports.getDashboard = async (req, res) => {
  try {
    const totalRegistrations = await Registration.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const pendingRegistrations = await Registration.countDocuments({ status: 'pending' });
    const approvedRegistrations = await Registration.countDocuments({ status: 'approved' });
    const totalProjects = await Project.countDocuments();
    const totalMessages = await ContactMessage.countDocuments({ status: 'unread' });

    // Course wise breakdown
    const courseStats = await Registration.aggregate([
      { $group: { _id: '$selectedCourse', count: { $sum: 1 } } }
    ]);

    const recentRegistrations = await Registration.find().sort({ createdAt: -1 }).limit(8);

    res.render('admin/dashboard', {
      title: 'LTI Admin Control Center',
      totalRegistrations,
      totalStudents,
      pendingRegistrations,
      approvedRegistrations,
      totalProjects,
      totalMessages,
      courseStats,
      recentRegistrations
    });
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    res.status(500).render('pages/error', { message: 'Server error loading admin dashboard' });
  }
};

// 2. Registrations Management
exports.getRegistrations = async (req, res) => {
  try {
    const { course, status, search } = req.query;
    let query = {};

    if (course && course !== 'All') {
      query.selectedCourse = course;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { schoolCollege: { $regex: search, $options: 'i' } }
      ];
    }

    const registrations = await Registration.find(query).sort({ createdAt: -1 });
    const courses = await Course.find();

    res.render('admin/registrations', {
      title: 'Course Registrations | Admin',
      registrations,
      courses,
      selectedCourse: course || 'All',
      selectedStatus: status || 'All',
      searchQuery: search || ''
    });
  } catch (error) {
    console.error('Admin Registrations Error:', error);
    res.status(500).render('pages/error', { message: 'Error fetching registrations' });
  }
};

exports.updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      req.session.errorMsg = 'Invalid status value.';
      return res.redirect('/admin/registrations');
    }

    await Registration.findByIdAndUpdate(id, { status });
    req.session.successMsg = `Registration status updated to ${status.toUpperCase()}`;
    res.redirect('/admin/registrations');
  } catch (error) {
    console.error('Update Registration Status Error:', error);
    req.session.errorMsg = 'Failed to update registration status.';
    res.redirect('/admin/registrations');
  }
};

// 3. Project Management
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.render('admin/projects', {
      title: 'Internal Projects Management | Admin',
      projects
    });
  } catch (error) {
    console.error('Admin Projects Error:', error);
    res.status(500).render('pages/error', { message: 'Error loading projects management' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { title, category, description, detailedContent, technologies, status, featured } = req.body;
    
    let techArray = [];
    if (technologies) {
      techArray = technologies.split(',').map(t => t.trim()).filter(Boolean);
    }

    let imagePath = '/images/default-project.jpg';
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }

    await Project.create({
      title,
      category,
      description,
      detailedContent: detailedContent || '',
      technologies: techArray,
      image: imagePath,
      status: status || 'published',
      featured: featured === 'on' || featured === 'true',
      createdBy: req.session.user._id
    });

    req.session.successMsg = 'Internal project created successfully!';
    res.redirect('/admin/projects');
  } catch (error) {
    console.error('Create Project Error:', error);
    req.session.errorMsg = 'Failed to create internal project.';
    res.redirect('/admin/projects');
  }
};

exports.toggleProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.redirect('/admin/projects');

    project.status = project.status === 'published' ? 'unpublished' : 'published';
    await project.save();

    req.session.successMsg = `Project "${project.title}" is now ${project.status.toUpperCase()}`;
    res.redirect('/admin/projects');
  } catch (error) {
    console.error('Toggle Project Status Error:', error);
    req.session.errorMsg = 'Failed to toggle project status.';
    res.redirect('/admin/projects');
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    req.session.successMsg = 'Project deleted successfully.';
    res.redirect('/admin/projects');
  } catch (error) {
    console.error('Delete Project Error:', error);
    req.session.errorMsg = 'Failed to delete project.';
    res.redirect('/admin/projects');
  }
};

// 4. Contact Messages View
exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.render('admin/messages', {
      title: 'Contact Messages | Admin',
      messages
    });
  } catch (error) {
    console.error('Admin Messages Error:', error);
    res.status(500).render('pages/error', { message: 'Error loading contact messages' });
  }
};

exports.markMessageRead = async (req, res) => {
  try {
    const { id } = req.params;
    await ContactMessage.findByIdAndUpdate(id, { status: 'read' });
    req.session.successMsg = 'Message marked as read.';
    res.redirect('/admin/messages');
  } catch (error) {
    console.error('Mark Message Read Error:', error);
    res.redirect('/admin/messages');
  }
};
