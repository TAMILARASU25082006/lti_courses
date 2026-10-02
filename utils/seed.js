require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');

const connectDB = require('../config/database');

const seedData = async () => {
  await connectDB();

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
        mobile: '8610621246',
        schoolCollege: 'LTI Ed-Tech HQ',
        qualification: 'Administrator'
      });
      console.log('✔ Admin user created (email: admin@lticourses.com, password: AdminPassword123!)');
    }

    // 2. Seed Courses
    await Course.deleteMany({});
    const courses = [
      {
        title: 'Robotics Education',
        slug: 'robotics-education',
        category: 'robotics',
        subtitle: 'Hands-on hardware, electronics, logic circuits, and autonomous microcontrollers',
        description: 'Explore the world of modern robotics through practical hardware building, sensor integrations, logic design, and C/C++ micro-controller programming.',
        highlights: [
          '3 Structured progression levels from beginner to advanced automation',
          'Hands-on physical hardware kits, microcontrollers, and sensors',
          'Practical real-world robotics project building',
          'Taught by experienced engineering mentors'
        ],
        topics: [
          'Electronics Fundamentals & Circuit Design',
          'Sensors, Transducers & Actuators',
          'Breadboard Wiring & Digital Logic',
          'Wireless Systems & RF/Bluetooth Control',
          'Arduino & Embedded C/C++ Programming',
          'Autonomous Mobile Robotics'
        ],
        eligibility: '4th Standard and above',
        image: '/images/robotics_course.jpg',
        levels: [
          {
            levelNumber: 1,
            title: 'LEVEL 1 – SENSOR ROBOTICS',
            eligibility: '4th to 10th Standard',
            topics: [
              'Electronics and circuits',
              'Sensors and motors',
              'Introduction to robotics',
              'Build and test real robots'
            ],
            description: 'Foundation course introducing fundamental electronic components, basic circuits, motor control, and sensor operations through fun hands-on robot building.'
          },
          {
            levelNumber: 2,
            title: 'LEVEL 2 – LOGIC & ROBOTICS',
            eligibility: '5th Standard and above',
            topics: [
              'Breadboard circuits',
              'Digital logic',
              'Wireless systems',
              'Advanced robotics'
            ],
            description: 'Intermediate module focusing on breadboard circuit prototyping, digital logic gates, wireless communication modules, and complex robot mechanics.'
          },
          {
            levelNumber: 3,
            title: 'LEVEL 3 – CODING & AUTOMATION',
            eligibility: '5th Standard and above',
            topics: [
              'Arduino and C/C++ programming',
              'Sensors and wireless control',
              'Advanced robotics',
              'Real-world projects'
            ],
            description: 'Advanced robotics program introducing embedded C/C++ programming on microcontrollers, algorithm design, obstacle avoidance, and IoT integration.'
          }
        ]
      },
      {
        title: 'Full Stack Web Development',
        slug: 'fullstack-web-development',
        category: 'fullstack',
        subtitle: '200+ INTERNS SUCCESSFULLY TRAINED',
        description: 'Master full stack web development from scratch. Build production-ready web applications using HTML5, CSS3, JavaScript, Node.js, Express, and MongoDB.',
        highlights: [
          'Proven Track Record: 200+ Interns Trained in Full Stack Web Development',
          '100% Practical hands-on coding and real application deployment',
          'Industry-standard Git & GitHub workflows',
          'Full-stack project portfolio creation'
        ],
        topics: [
          'HTML5 & Modern Semantic Web Markup',
          'CSS3, Flexbox, CSS Grid & Responsive Design',
          'Modern JavaScript (ES6+), Async/Await & DOM Manipulation',
          'Responsive Web Layouts & Mobile First Design',
          'Backend Development with Node.js & Express.js',
          'Database Management with MongoDB Atlas & Mongoose',
          'RESTful API Design & Integration',
          'User Authentication, Sessions & Security Best Practices',
          'Git, GitHub Version Control & Project Deployment',
          'Full Stack Capstone Project Development'
        ],
        eligibility: 'Open to School & College Students, Beginners & Tech Enthusiasts',
        duration: '3 Months Practical Program',
        image: '/images/fullstack_course.jpg'
      },
      {
        title: 'UI/UX Design with AI',
        slug: 'ui-ux-design-with-ai',
        category: 'uiux',
        subtitle: 'TURN YOUR CREATIVITY INTO DIGITAL EXPERIENCES',
        description: 'Design intuitive, aesthetically impressive digital user interfaces powered by modern AI productivity tools, user research, wireframing, and interactive prototyping.',
        highlights: [
          'Comprehensive 1 Month Intensive Creative Program',
          'Industry standard design tools: Miro, Figma, Framer, Behance',
          'AI-assisted wireframing, layout generation, and asset design',
          'Personal Design Portfolio Creation'
        ],
        topics: [
          'Design Thinking & User-Centered Research',
          'User Personas, Empathy Mapping & User Journeys',
          'Wireframing & Information Architecture (Miro & Figma)',
          'High-Fidelity Interactive Prototyping (Framer & Figma)',
          'User Interface (UI) Visual Hierarchy & Color Theory',
          'User Experience (UX) Heuristics & Usability Testing',
          'Responsive Cross-Platform Web & Mobile Layouts',
          'AI-Assisted Prompt Design & Fast Wireframe Generation',
          'Design System Components & Micro-interactions',
          'Portfolio Creation & Publishing on Behance'
        ],
        eligibility: 'Students, Designers, Creators & Aspiring UI/UX Engineers',
        duration: '1 Month',
        image: '/images/fullstack_course.jpg'
      }
    ];

    await Course.insertMany(courses);
    console.log('✔ Courses seeded successfully.');

    // 3. Seed Published Internal Projects
    await Project.deleteMany({});
    const projects = [
      {
        title: 'Autonomous obstacle-avoiding mobile robot',
        category: 'Robotics Projects',
        description: 'A custom-engineered 4-wheel drive robotics platform featuring ultrasonic distance sensing, dual motor drivers, and automated navigation logic designed by LTI research lab.',
        detailedContent: 'Designed and fabricated entirely in LTI Robotics Lab. Uses an ATmega328P microcontroller, dual H-bridge motor drivers, ultrasonic sonar sensors, and custom chassis chassis tuning for precise obstacle detection and path re-routing.',
        technologies: ['Arduino', 'C/C++', 'Ultrasonic Sonar', 'L298N Motor Driver', 'Embedded Systems'],
        image: '/images/robotics_course.jpg',
        status: 'published',
        featured: true,
        createdBy: admin._id
      },
      {
        title: 'LTI EdTech Student & Assessment Portal',
        category: 'Full Stack Projects',
        description: 'Complete centralized web application for managing student enrollments, course content delivery, profile management, and internal project showcases.',
        detailedContent: 'Built using Node.js, Express, MongoDB Atlas, and custom responsive Vanilla CSS with glassmorphism design accents. Features secure session authentication, multer upload pipelines, and role-based permissions.',
        technologies: ['Node.js', 'Express.js', 'MongoDB Atlas', 'EJS', 'Vanilla CSS', 'Bcrypt'],
        image: '/images/fullstack_course.jpg',
        status: 'published',
        featured: true,
        createdBy: admin._id
      },
      {
        title: 'AI-Driven Adaptive Learning Interface Prototype',
        category: 'UI/UX Projects',
        description: 'Interactive UI/UX prototype created in Figma and Framer displaying personalized course progression, real-time code execution widgets, and dark mode interface components.',
        detailedContent: 'Designed following strict micro-interaction patterns and high-contrast accessible styling (Black, Deep Charcoal, Golden Yellow accents). Includes complete Figma design tokens and component library.',
        technologies: ['Figma', 'Framer', 'Miro', 'Design Systems', 'AI Design Tools'],
        image: '/images/hero_banner.jpg',
        status: 'published',
        featured: true,
        createdBy: admin._id
      },
      {
        title: 'IoT Micro-Environment Sensor & Automation Hub',
        category: 'Research & Development',
        description: 'An embedded systems project combining ESP32 wireless microcontrollers, temperature/humidity sensors, and web dashboard monitoring.',
        detailedContent: 'R&D initiative combining wireless telemetry with a real-time web telemetry dashboard. Demonstrates cross-domain expertise across electronics, firmware programming, and full stack web development.',
        technologies: ['ESP32', 'C++', 'Node.js', 'WebSockets', 'Electronics'],
        image: '/images/robotics_course.jpg',
        status: 'published',
        featured: false,
        createdBy: admin._id
      }
    ];

    await Project.insertMany(projects);
    console.log('✔ Public showcase projects seeded successfully.');

    // 4. Seed Testimonials
    await Testimonial.deleteMany({});
    const testimonials = [
      {
        studentName: 'Karthik S.',
        role: 'Full Stack Trainee',
        courseName: 'Full Stack Web Development',
        content: 'Training at LTI was a turning point for me. Building real backend APIs and frontends from scratch gave me immense practical confidence.',
        rating: 5,
        published: true
      },
      {
        studentName: 'Priya Raman',
        role: 'Robotics Student',
        courseName: 'Robotics Education (Level 3)',
        content: 'Working with Arduino sensors, breadboards, and wireless control in LTI hands-on lab was super exciting. The mentors explain concepts clearly!',
        rating: 5,
        published: true
      },
      {
        studentName: 'Arun Kumar',
        role: 'UI/UX Student',
        courseName: 'UI/UX Design with AI',
        content: 'The 1-month AI UI/UX course taught me Figma, wireframing, and design systems. I created my own portfolio on Behance thanks to LTI!',
        rating: 5,
        published: true
      }
    ];

    await Testimonial.insertMany(testimonials);
    console.log('✔ Testimonials seeded successfully.');

    console.log('🎉 Seed script completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
