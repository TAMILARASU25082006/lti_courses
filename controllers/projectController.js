const Project = require('../models/Project');

exports.getProjectsPage = async (req, res) => {
  try {
    const selectedCategory = req.query.category || 'All';
    let query = { status: 'published' };
    
    if (selectedCategory !== 'All') {
      query.category = selectedCategory;
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });

    const categories = ['All', 'Robotics Projects', 'Full Stack Projects', 'UI/UX Projects', 'Research & Development'];

    res.render('pages/projects', {
      title: 'Internal Projects Showcase | LTI – Learn, Think & Innovate',
      projects,
      categories,
      selectedCategory
    });
  } catch (error) {
    console.error('Projects Page Error:', error);
    res.status(500).render('pages/error', { message: 'Server error loading internal project showcase' });
  }
};

exports.getProjectDetailPage = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

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
