const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { isLoggedIn } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddleware');

router.get('/profile', isLoggedIn, studentController.getStudentProfile);
router.post('/profile/update', isLoggedIn, upload.single('profileImage'), studentController.updateProfile);

module.exports = router;
