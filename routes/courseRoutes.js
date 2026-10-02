const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/courses', courseController.getCoursesPage);
router.get('/courses/:slug', courseController.getCourseDetailPage);

module.exports = router;
