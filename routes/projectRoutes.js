const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/projects', projectController.getProjectsPage);
router.get('/projects/:id', projectController.getProjectDetailPage);

module.exports = router;
