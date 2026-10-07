const User = require('../models/User');
const Course = require('../models/Course');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');

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

    // 2. Seed Courses
    const existingCourses = await Course.countDocuments();
    if (existingCourses === 0) {
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
              title: 'LEVEL 2 – BREADBOARD LOGIC & ROBOTICS',
              eligibility: '5th Standard and above (Duration: 12 Weeks)',
              topics: [
                'Robot 1: Line Following Robot (Breadboard Build)',
                'Robot 2: Obstacle Avoiding Robot (Breadboard Build)',
                'Robot 3: Edge Avoiding Robot (Breadboard Build)',
                'Robot 4: Wall Following Robot (Breadboard Build)',
                'Robot 5: Wireless Remote Control Car (433MHz RF)',
                'L293D Motor Driver & IC 7404 (NOT Gate)',
                'IC 7400 (NAND Gate) Logic & Memory Latches',
                'HT12E/HT12D Encoder/Decoder & RF Transmitter'
              ],
              description: 'Real Circuits. Real Logic. Real Innovators. Students move from ready-made modules to real breadboard circuits using L293D driver and logic ICs (7404, 7400) to build 5 advanced robots, ending with a working wireless remote control car.'
            },
            {
              levelNumber: 3,
              title: 'LEVEL 3 – CODING ROBOTICS WITH ARDUINO',
              eligibility: '5th Standard and above (Duration: 16 Weeks)',
              topics: [
                'Arduino Uno Microcontroller & C/C++ Coding',
                'Robot 1: Line Following Robot (C++ Firmware)',
                'Robot 2: Obstacle Avoiding Sonar Servo Robot',
                'Robot 3: IR Remote Controlled Robot',
                'Robot 4: Bluetooth Wireless Controlled Robot',
                'Robot 5: Line-Following Automation System'
              ],
              description: 'Code. Innovate. Automate. Students enter the world of coding! Using Arduino, sensors, and modules, they build 5 intelligent robots and an automated line-following industrial system.'
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
          image: '/images/hero_banner.jpg'
        }
      ];
      await Course.insertMany(courses);
      console.log('✔ Courses auto-seeded.');
    }

    // 3. Seed Published Internal Projects
    const existingProjects = await Project.countDocuments();
    if (existingProjects === 0) {
      const projects = [
        {
          title: 'High-Precision Line Following Robot',
          category: 'Robotics Projects',
          description: 'Autonomous 2-wheel drive robot with a 4-channel TCRT5000 IR sensor array for high-speed black line tracking on white surface.',
          detailedContent: 'Designed and built in LTI Robotics Lab using Arduino Uno R3, dual TT gear motors with yellow traction wheels, dual-layer black acrylic chassis matrix, and PID control algorithm.',
          technologies: ['Arduino Uno', 'IR Sensor Array', 'L298N Driver', 'PID Logic', '3D CAD'],
          image: '/images/line_follower_robot.jpg',
          status: 'published',
          featured: true,
          has3DModel: true,
          model3DType: 'line-follower',
          studentAuthor: 'LTI Student Robotics Team',
          modelSpecs: {
            chassis: 'Dual-Layer Black Acrylic Matrix with Brass Standoffs',
            microcontroller: 'Arduino Uno R3 Core Board (C/C++ PID Firmware)',
            sensors: '4-Channel Downward TCRT5000 IR Reflectance Array',
            motors: '2x Dual Shaft Yellow TT Motors with L298N Motor Driver'
          },
          createdBy: admin._id
        },
        {
          title: 'Autonomous Obstacle Avoiding Mobile Robot',
          category: 'Robotics Projects',
          description: 'Smart navigation rover featuring HC-SR04 ultrasonic sonar mounted on a 180-degree SG90 servo turret for real-time obstacle avoidance.',
          detailedContent: 'Custom engineered by LTI students with dual-deck black acrylic chassis, SG90 servo motor turret, HC-SR04 sonar sensor, and pulse timing echo calculations.',
          technologies: ['Arduino', 'C/C++', 'Ultrasonic Sonar', 'SG90 Servo', '3D CAD'],
          image: '/images/obstacle_avoiding_robot.jpg',
          status: 'published',
          featured: true,
          has3DModel: true,
          model3DType: 'obstacle-avoiding',
          studentAuthor: 'Priya Raman & Level 2 Robotics Team',
          modelSpecs: {
            chassis: 'Dual-Tier Black Acrylic Chassis Plate',
            microcontroller: 'Arduino Uno R3 Microcontroller',
            sensors: 'Front HC-SR04 Ultrasonic Sonar on SG90 Servo Turret',
            motors: '2x High Traction Yellow Wheels with Dual Motor Driver'
          },
          createdBy: admin._id
        },
        {
          title: 'Smart Edge & Cliff Avoiding Robot',
          category: 'Robotics Projects',
          description: 'Safety-critical autonomous robot featuring top ultrasonic sonar and dual downward front IR cliff sensors to prevent table drop-offs.',
          detailedContent: 'Constructed with dual front cliff detection sensors pointing down towards the table edge, triggering emergency reverse and 180-degree rotation when drop-offs are detected.',
          technologies: ['Arduino Uno', 'Cliff IR Sensors', 'Ultrasonic Sonar', 'Safety Algorithm'],
          image: '/images/edge_avoiding_robot.jpg',
          status: 'published',
          featured: true,
          has3DModel: true,
          model3DType: 'edge-avoiding',
          studentAuthor: 'Karthik & Level 3 Robotics Group',
          modelSpecs: {
            chassis: 'Dual-Layer Black Acrylic with Edge Protection Brackets',
            microcontroller: 'Arduino Uno R3 Microcontroller',
            sensors: 'HC-SR04 Sonar + Dual Downward Cliff IR Sensors',
            motors: '2x High Speed Yellow Motors with Emergency Reverse Logic'
          },
          createdBy: admin._id
        },
        {
          title: 'Wall & Object Following Autonomous Robot',
          category: 'Robotics Projects',
          description: '4-wheel drive robotics platform equipped with side distance tracking ultrasonic sonar and front IR object detection sensor.',
          detailedContent: 'Features a 4WD chassis with 4 yellow all-terrain drive wheels, ultrasonic sonar for keeping a constant 15cm distance along side walls, and front object following sensors.',
          technologies: ['Arduino Uno', '4WD Chassis', 'Wall Follower Sonar', 'Object Tracker'],
          image: '/images/wall_object_following_robot.jpg',
          status: 'published',
          featured: true,
          has3DModel: true,
          model3DType: 'wall-object-following',
          studentAuthor: 'Arun Kumar & LTI Senior Robotics Team',
          modelSpecs: {
            chassis: '4WD Heavy All-Terrain Black Acrylic Chassis',
            microcontroller: 'Arduino Uno R3 Core Board',
            sensors: 'HC-SR04 Wall Distance Sonar + Front IR Object Tracker',
            motors: '4x Yellow TT Gear Motors for 4WD Traction'
          },
          createdBy: admin._id
        },
        {
          title: 'LTI EdTech Learning & Registration Portal',
          category: 'Full Stack Projects',
          description: 'Complete centralized web platform managing student course enrollments, profile management, and internal project showcases.',
          detailedContent: 'Built using Node.js, Express, MongoDB Atlas, and custom responsive Vanilla CSS with glassmorphism design accents.',
          technologies: ['Node.js', 'Express.js', 'MongoDB Atlas', 'EJS', 'Vanilla CSS'],
          image: '/images/fullstack_course.jpg',
          status: 'published',
          featured: true,
          createdBy: admin._id
        },
        {
          title: 'AI-Driven Adaptive Learning Interface Prototype',
          category: 'UI/UX Projects',
          description: 'Interactive UI/UX prototype created in Figma and Framer displaying personalized course progression and dark mode design components.',
          detailedContent: 'Designed following strict micro-interaction patterns and high-contrast accessible styling with golden yellow accents.',
          technologies: ['Figma', 'Framer', 'Miro', 'Behance'],
          image: '/images/hero_banner.jpg',
          status: 'published',
          featured: true,
          createdBy: admin._id
        }
      ];
      await Project.insertMany(projects);
      console.log('✔ Internal Projects auto-seeded.');
    }

    // 4. Seed Testimonials
    const existingTestimonials = await Testimonial.countDocuments();
    if (existingTestimonials === 0) {
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
      console.log('✔ Testimonials auto-seeded.');
    }
  } catch (err) {
    console.error('Error in seedDataHelper:', err.message);
  }
};

module.exports = seedDataHelper;
