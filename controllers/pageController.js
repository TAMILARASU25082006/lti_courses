const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const ContactMessage = require('../models/ContactMessage');
const Course = require('../models/Course');
const { validationResult } = require('express-validator');

exports.getHomePage = async (req, res) => {
  try {
    const featuredProjects = await Project.find({ status: 'published' }).limit(3).sort({ createdAt: -1 });
    const testimonials = await Testimonial.find({ published: true }).limit(3);
    const courses = await Course.find({ active: true });

    res.render('pages/home', {
      title: 'LTI_COURSES – Learn Today. Build Tomorrow. Innovate Beyond.',
      featuredProjects,
      testimonials,
      courses
    });
  } catch (error) {
    console.error('Home Page Error:', error);
    res.status(500).render('pages/error', { message: 'Server error loading home page' });
  }
};

exports.getAboutPage = (req, res) => {
  res.render('pages/about', {
    title: 'About Us | LTI – Learn, Think & Innovate'
  });
};

exports.getContactPage = (req, res) => {
  res.render('pages/contact', {
    title: 'Contact Us | LTI Technology',
    companyPhone: process.env.COMPANY_PHONE || '9342988487',
    companyEmail: process.env.COMPANY_EMAIL || 'lti4official26@gmail.com',
    companyAddress: 'No. 3B, Ethiraj Swamy Salai, Erukancheri, Chennai – 600118, Tamil Nadu, India.',
    landmark: 'Opposite Don Bosco School',
    whatsappChannel: 'https://whatsapp.com/channel/0029Vb8HL0T4dTnBl8HyO02E'
  });
};

exports.postContactMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.errorMsg = errors.array()[0].msg;
    return res.redirect('/contact');
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    await ContactMessage.create({
      name,
      email,
      phone,
      subject: subject || 'General Inquiry',
      message
    });

    req.session.successMsg = 'Thank you for reaching out! Your message has been sent to LTI team. We will contact you soon.';
    res.redirect('/contact');
  } catch (error) {
    console.error('Contact Form Error:', error);
    req.session.errorMsg = 'Failed to submit contact message. Please try again.';
    res.redirect('/contact');
  }
};
