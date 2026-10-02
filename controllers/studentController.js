const User = require('../models/User');
const Registration = require('../models/Registration');

exports.getStudentProfile = async (req, res) => {
  try {
    const studentId = req.session.user._id;
    const user = await User.findById(studentId).select('-password');
    if (!user) {
      req.session.destroy();
      return res.redirect('/login');
    }

    // Fetch user registrations by email or userId
    const registrations = await Registration.find({
      $or: [
        { userId: studentId },
        { email: user.email.toLowerCase() }
      ]
    }).sort({ createdAt: -1 });

    res.render('pages/profile', {
      title: 'Student Dashboard & Profile | LTI_COURSES',
      user,
      registrations
    });
  } catch (error) {
    console.error('Student Profile Error:', error);
    res.status(500).render('pages/error', { message: 'Server error loading student profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const studentId = req.session.user._id;
    const { fullName, mobile, schoolCollege, qualification, bio } = req.body;

    const user = await User.findById(studentId);
    if (!user) return res.redirect('/login');

    if (fullName) user.fullName = fullName.trim();
    if (mobile) user.mobile = mobile.trim();
    if (schoolCollege) user.schoolCollege = schoolCollege.trim();
    if (qualification) user.qualification = qualification.trim();
    if (bio !== undefined) user.bio = bio.trim();

    // Check if new profile image was uploaded
    if (req.file) {
      user.profileImage = '/uploads/' + req.file.filename;
      req.session.user.profileImage = user.profileImage;
    }

    await user.save();

    // Update session user name
    req.session.user.fullName = user.fullName;

    req.session.successMsg = 'Profile updated successfully!';
    res.redirect('/profile');
  } catch (error) {
    console.error('Update Profile Error:', error);
    req.session.errorMsg = 'Failed to update profile details.';
    res.redirect('/profile');
  }
};
