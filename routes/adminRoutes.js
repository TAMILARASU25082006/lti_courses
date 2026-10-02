const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddleware');

// Protect all admin routes
router.use(isAdmin);

// Overview dashboard
router.get('/admin', adminController.getDashboard);

// Registrations management
router.get('/admin/registrations', adminController.getRegistrations);
router.post('/admin/registrations/:id/status', adminController.updateRegistrationStatus);

// Internal Project management
router.get('/admin/projects', adminController.getProjects);
router.post('/admin/projects/create', upload.single('projectImage'), adminController.createProject);
router.post('/admin/projects/:id/toggle', adminController.toggleProjectStatus);
router.post('/admin/projects/:id/delete', adminController.deleteProject);

// Contact messages
router.get('/admin/messages', adminController.getMessages);
router.post('/admin/messages/:id/read', adminController.markMessageRead);

module.exports = router;
