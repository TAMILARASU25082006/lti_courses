const Project = require('../models/Project');
const mongoose = require('mongoose');
const { defaultProjects } = require('../utils/defaultData');

exports.getProjectsPage = async (req, res) => {
  try {
    const selectedCategory = req.query.category || 'All';
    let query = { status: 'published' };
    
    if (selectedCategory !== 'All') {
      query.category = selectedCategory;
    }

    let projects = [];
    if (mongoose.connection.readyState === 1) {
      projects = await Project.find(query).sort({ createdAt: -1 });
    }

    if (!projects || projects.length === 0) {
      if (selectedCategory === 'All') {
        projects = defaultProjects;
      } else {
        projects = defaultProjects.filter(p => p.category === selectedCategory);
      }
    }

    const categories = ['All', 'Robotics Projects', 'Full Stack Projects', 'UI/UX Projects', 'Research & Development'];

    res.render('pages/projects', {
      title: 'Internal Projects Showcase | LTI – Learn, Think & Innovate',
      projects,
      categories,
      selectedCategory
    });
  } catch (error) {
    console.error('Projects Page Error:', error);
    const selectedCategory = req.query.category || 'All';
    const fallbackProjects = (selectedCategory === 'All') 
      ? defaultProjects 
      : defaultProjects.filter(p => p.category === selectedCategory);

    res.render('pages/projects', {
      title: 'Internal Projects Showcase | LTI – Learn, Think & Innovate',
      projects: fallbackProjects,
      categories: ['All', 'Robotics Projects', 'Full Stack Projects', 'UI/UX Projects', 'Research & Development'],
      selectedCategory
    });
  }
};

exports.getProjectDetailPage = async (req, res) => {
  try {
    const { id } = req.params;
    let project = null;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      project = await Project.findById(id);
    }

    if (!project) {
      project = defaultProjects.find(p => p._id === id || p.title.toLowerCase().includes(String(id).toLowerCase()));
    }

    // Only allow viewing if published OR if user is admin
    if (!project || (project.status !== 'published' && (!req.session.user || req.session.user.role !== 'admin'))) {
      req.session.errorMsg = 'Project not found or private.';
      return res.redirect('/projects');
    }

    res.render('pages/project-detail', {
      title: `${project.title} | LTI Projects`,
      project
    });
  } catch (error) {
    console.error('Project Detail Error:', error);
    res.status(500).render('pages/error', { message: 'Server error loading project details' });
  }
};
