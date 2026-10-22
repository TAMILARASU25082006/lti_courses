const User = require('../models/User');
const Course = require('../models/Course');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const { defaultCourses, defaultProjects, defaultTestimonials } = require('./defaultData');

const seedDataHelper = async () => {
  try {
    // 1. Seed Admin User
    const adminEmail = 'admin@lticourses.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        fullName: 'LTI Administrator',
        email: adminEmail,
        password: 'AdminPassword123!',
        role: 'admin',
        mobile: '9342988487',
        schoolCollege: 'LTI Ed-Tech HQ',
        qualification: 'Administrator'
      });
      console.log('✔ Admin user initialized (admin@lticourses.com / AdminPassword123!)');
    }

    // 2. Ensure Flagship Courses Exist & Are Synced
    for (const c of defaultCourses) {
      await Course.findOneAndUpdate(
        { slug: c.slug },
        c,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log('✔ Flagship courses verified & synced in MongoDB.');

    // 3. Ensure All Internal Projects & Live Intern Projects Exist
    for (const p of defaultProjects) {
      const projData = { ...p, createdBy: admin ? admin._id : null };
      delete projData._id;
      await Project.findOneAndUpdate(
        { title: p.title },
        projData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log('✔ Internal & intern projects verified & synced in MongoDB.');

    // 4. Ensure Testimonials Exist
    for (const t of defaultTestimonials) {
      await Testimonial.findOneAndUpdate(
        { studentName: t.studentName },
        t,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log('✔ Testimonials verified & synced in MongoDB.');
  } catch (err) {
    console.error('Error in seedDataHelper:', err.message);
  }
};

module.exports = seedDataHelper;
