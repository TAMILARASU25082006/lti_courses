# GEMINI.md - LTI Courses Project Master Documentation

> **LTI_COURSES – Learn Today. Build Tomorrow. Innovate Beyond.**  
> Comprehensive technical documentation, architecture overview, data models, routes, 3D robotics engine, and operational workflows for the LTI Courses EdTech Platform.

---

## 1. Executive Summary & Project Identity

- **Platform Name**: LTI Courses (`lti_cource` / `LTI_COURSES`)
- **Organization**: LTI (Learn, Think & Innovate)
- **Headquarters**: No. 3B, Ethiraj Swamy Salai, Erukancheri, Chennai – 600118, Tamil Nadu, India (Opposite Don Bosco School)
- **Contact Details**: 
  - Phone: `+91 9342988487`
  - Email: `lti4official26@gmail.com`
  - WhatsApp Channel: `https://whatsapp.com/channel/0029Vb8HL0T4dTnBl8HyO02E`
- **GitHub Repository**: [https://github.com/TAMILARASU25082006/lti_courses.git](https://github.com/TAMILARASU25082006/lti_courses.git)
- **Primary Mission**: Practical, hands-on technology education focusing on hardware robotics (Levels 1 to 3), Full-Stack Web Development (with 200+ trained interns), and UI/UX Design powered by AI.

---

## 2. Complete Technology Stack

| Layer | Technology | Version | Purpose / Role |
| :--- | :--- | :--- | :--- |
| **Backend Runtime** | Node.js | `>=18` | Server execution environment |
| **Web Framework** | Express.js | `^4.21.2` | Application server, routing, and REST middleware |
| **Templating Engine** | EJS (Embedded JavaScript) | `^3.1.10` | Server-side HTML rendering with partials |
| **Database** | MongoDB | `^8.9.3` (Mongoose) | Primary NoSQL document database |
| **Database Fallback** | `mongodb-memory-server` | `^11.3.0` | In-memory MongoDB for local dev when offline |
| **Session Store** | `connect-mongo` + `express-session`| `^5.1.0` / `^1.18.1` | Persistent MongoDB session storage |
| **Authentication** | Passport.js + `passport-google-oauth20` | `^0.7.0` / `^2.0.0` | Google OAuth 2.0 social login & session serialization |
| **Password Security**| `bcrypt` | `^5.1.1` | Salt generation and bcrypt password hashing |
| **File Uploads** | `multer` | `^1.4.5-lts.1` | Multi-part form handling for profile/project images |
| **Validation** | `express-validator` | `^7.2.1` | Schema sanitization and request body validation |
| **Email Service** | `nodemailer` | `^6.9.16` | Automated notifications & lead alerts via SMTP |
| **Styling (CSS)** | Tailwind CSS (CDN) + Vanilla CSS | Custom CDN | Dark glassmorphism, responsive grid, gold palette |
| **3D Graphics Engine**| Three.js + `OrbitControls` | `r128` | WebGL 3D CAD inspector with exploded view |

---

## 3. Directory Structure & File Map

```text
lti_courses/
├── config/
│   ├── database.js               # MongoDB connection with automatic MongoMemoryServer fallback
│   └── passport.js               # Google OAuth 2.0 Passport strategy & user serialization
├── controllers/
│   ├── adminController.js        # Admin dashboard stats, registrations, project management, messages
│   ├── authController.js         # Signup, login, logout, password check, and role assignment
│   ├── courseController.js       # Course catalogue & course detail pages by slug
│   ├── pageController.js         # Static/content pages: Home, About Us, Contact Us form handling
│   ├── projectController.js      # Student projects showcase and 3D detail inspection
│   ├── registrationController.js # Course enrollment workflow, validation, and duplicates prevention
│   └── studentController.js      # Student dashboard, profile edit, and avatar uploads
├── middleware/
│   ├── authMiddleware.js         # Session context provider (res.locals), isLoggedIn, and isAdmin guards
│   └── multerMiddleware.js       # Disk storage configuration and mime/ext image filtering (5MB limit)
├── models/
│   ├── ContactMessage.js         # Inquiries from contact page (unread/read/replied)
│   ├── Course.js                 # Course catalogue schema with nested multi-level syllabi
│   ├── Project.js                # Showcase projects schema with 3D model configuration
│   ├── Registration.js           # Student enrollment applications with status tracking
│   ├── Testimonial.js            # Student reviews, feedback, star ratings
│   └── User.js                   # Student and Admin accounts with bcrypt pre-save hook
├── public/
│   ├── css/
│   │   ├── admin.css             # Dedicated styling for admin tables, badges, and controls
│   │   └── style.css             # Global layout, glassmorphism cards, buttons, responsive rules
│   ├── images/
│   │   ├── edge_avoiding_robot.jpg
│   │   ├── fullstack_course.jpg
│   │   ├── hero_banner.jpg
│   │   ├── line_follower_robot.jpg
│   │   ├── lti_logo.jpg
│   │   ├── obstacle_avoiding_robot.jpg
│   │   ├── robotics_course.jpg
│   │   └── wall_object_following_robot.jpg
│   ├── js/
│   │   ├── main.js               # Mobile navbar toggle, password show/hide, form dynamic fields
│   │   └── robot3dViewer.js      # Three.js 3D rendering engine for 15 student robot presets
│   └── uploads/                  # User avatar and project media uploads destination
├── routes/
│   ├── adminRoutes.js            # Protected /admin/* routes
│   ├── authRoutes.js             # /signup, /login, /logout, /auth/google, /auth/google/callback
│   ├── courseRoutes.js           # /courses, /courses/:slug
│   ├── pageRoutes.js             # /, /about, /contact
│   ├── projectRoutes.js          # /projects, /projects/:id
│   ├── registrationRoutes.js     # /register (GET & POST)
│   └── studentRoutes.js          # /profile, /profile/update (Protected student routes)
├── utils/
│   ├── seed.js                   # Manual standalone database seeding script (`npm run seed`)
│   ├── seedDataHelper.js         # Automatic boot-time database seeder
│   └── testApp.js                # End-to-end HTTP route health checker
├── views/
│   ├── admin/
│   │   ├── dashboard.ejs         # High-level stats, course counts, recent registrations
│   │   ├── messages.ejs          # Contact inquiries management table
│   │   ├── projects.ejs          # Internal project creation modal, toggle status, delete
│   │   └── registrations.ejs     # Filterable/searchable registration table with status approvals
│   ├── pages/
│   │   ├── about.ejs             # Company vision, pedagogical framework, mentor details
│   │   ├── contact.ejs           # Contact form, direct phone/email, address, WhatsApp links
│   │   ├── course-detail.ejs     # Deep syllabus view, levels breakdown, syllabus breakdown
│   │   ├── courses.ejs           # All 3 flagship courses overview with feature grids
│   │   ├── error.ejs             # Friendly 404/500 error display
│   │   ├── home.ejs              # Hero banner, stats counter, course cards, 3D lab teaser, reviews
│   │   ├── login.ejs             # Dual login (Email/Password & Google Sign-In)
│   │   ├── profile.ejs           # Student dashboard with enrolled courses status & info edit
│   │   ├── project-detail.ejs    # Individual project specs, hardware breakdown, 3D modal launch
│   │   ├── projects.ejs          # Filterable project gallery with 3D model inspector button
│   │   ├── register-success.ejs  # Post-submission confirmation ticket
│   │   ├── register.ejs          # Dynamic registration form (triggers Level picker for Robotics)
│   │   └── signup.ejs            # Student registration with optional admin secret key
│   └── partials/
│       ├── flash.ejs             # Toast notifications for errorMsg and successMsg
│       ├── footer.ejs            # Footer navigation, copyright, social and address info
│       ├── header.ejs            # HTML5 head, Tailwind CDN, Three.js CDN, custom CSS
│       ├── navbar.ejs            # Top navigation bar with responsive mobile menu & user session buttons
│       └── robot3dModal.ejs      # Fullscreen interactive 3D WebGL modal & controls
├── .env.example                  # Environment configuration template
├── package.json                  # Scripts, metadata, and dependencies
└── server.js                     # Main application entry point & pipeline initialization
```

---

## 4. Core Educational Offerings

### Course 1: Robotics Education (`robotics-education`)
- **Category**: `robotics`
- **Target Audience**: 4th Standard and above
- **Three Structured Progression Levels**:
  1. **Level 1 – Sensor Robotics (4th to 10th Std)**:
     - Fundamentals of electronics, basic DC motor control, L293N/L293D motor drivers.
     - Hands-on robots: Line Following, Obstacle Avoiding, Edge Avoiding, Wall Following, Object Following.
  2. **Level 2 – Breadboard Logic & Robotics (5th Std+, 12 Weeks)**:
     - Eliminates ready-made breakout modules; students wire discrete circuits on solderless breadboards.
     - IC 7404 (NOT Gate), IC 7400 (NAND Gate) logic latches, L293D IC, HT12E/HT12D RF 433MHz wireless remote control car.
  3. **Level 3 – Coding Robotics with Arduino (5th Std+, 16 Weeks)**:
     - Arduino Uno R3 (ATmega328P), Embedded C/C++ firmware, pulse-width modulation (PWM), servo scanning sonar turrets.
     - Bluetooth control (HC-05), IR keyfob decoding (TSOP1838), and high-precision industrial automated line-following with optical wheel encoders.

### Course 2: Full Stack Web Development (`fullstack-web-development`)
- **Category**: `fullstack`
- **Track Record**: **200+ Interns Successfully Trained**
- **Duration**: 3 Months Practical Program
- **Curriculum Highlights**: Semantic HTML5, CSS3 Grid/Flexbox, JavaScript ES6+ (Async/Await), Node.js, Express.js REST APIs, MongoDB Atlas, Session Authentication, Git & GitHub workflows, and full-stack capstone deployment.

### Course 3: UI/UX Design with AI (`ui-ux-design-with-ai`)
- **Category**: `uiux`
- **Duration**: 1 Month Intensive Creative Program
- **Curriculum Highlights**: Design Thinking, User Empathy Mapping, Information Architecture (Miro), Wireframing & High-Fidelity Interactive Prototyping (Figma & Framer), AI-assisted wireframe and prompt design, Design Systems, and Behance portfolio creation.

---

## 5. Database Schema & Data Models

### 1. `User` Model (`models/User.js`)
Stores authentication identities for both students and administrators.
- `fullName`: String (Required, trimmed)
- `email`: String (Required, unique, lowercase, regex validated)
- `password`: String (Required if `googleId` is null; minlength 6; auto-hashed via bcrypt pre-save)
- `googleId`: String (Optional, stores Google OAuth profile ID)
- `mobile`: String (10-digit phone number)
- `schoolCollege`: String (Institution name)
- `qualification`: String (Academic degree or standard)
- `role`: Enum `['student', 'admin']` (Default: `'student'`)
- `profileImage`: String (Default: `'/images/default-avatar.png'`)
- `bio`: String (Student biography/description)
- `timestamps`: Enabled (`createdAt`, `updatedAt`)

### 2. `Course` Model (`models/Course.js`)
Manages academic tracks and multi-tiered syllabi.
- `title`: String (Required)
- `slug`: String (Unique, lowercase, URL-friendly)
- `category`: Enum `['robotics', 'fullstack', 'uiux']`
- `subtitle`: String
- `description`: String
- `highlights`: [String]
- `topics`: [String]
- `eligibility`: String
- `levels`: Embedded array of `levelSchema`:
  - `levelNumber`: Number
  - `title`: String
  - `eligibility`: String
  - `topics`: [String]
  - `description`: String
- `duration`: String (e.g., `'12 Weeks'`, `'3 Months'`)
- `image`: String (URL or asset path)
- `active`: Boolean (Default: `true`)

### 3. `Project` Model (`models/Project.js`)
Internal showcases and student hardware creations with 3D model metadata.
- `title`: String (Required)
- `category`: Enum `['Robotics Projects', 'Full Stack Projects', 'UI/UX Projects', 'Research & Development']`
- `description`: String (Short summary)
- `detailedContent`: String (Long-form technical description)
- `technologies`: [String]
- `image`: String
- `status`: Enum `['published', 'unpublished']` (Default: `'published'`)
- `featured`: Boolean (Default: `false`)
- `has3DModel`: Boolean (Default: `false`)
- `model3DType`: String (Preset key: `'line-follower'`, `'obstacle-avoiding'`, etc.)
- `studentAuthor`: String
- `modelSpecs`: Subdocument containing:
  - `chassis`: String
  - `microcontroller`: String
  - `sensors`: String
  - `motors`: String
  - `power`: String
- `createdBy`: ObjectId (Ref: `'User'`)

### 4. `Registration` Model (`models/Registration.js`)
Handles student enrollments submitted via the portal.
- `fullName`: String (Required)
- `email`: String (Required, validated email)
- `mobile`: String (Required, 10-digit regex)
- `schoolCollege`: String (Required)
- `qualification`: String (Required)
- `selectedCourse`: String (Required)
- `roboticsLevel`: String (Default: `'N/A'`)
- `preferredMode`: Enum `['Offline Classroom', 'Online Live', 'Hybrid']`
- `message`: String
- `registrationType`: Enum `['website', 'google_forms']`
- `status`: Enum `['pending', 'approved', 'rejected']` (Default: `'pending'`)
- `userId`: ObjectId (Ref: `'User'`, optional if logged in)

### 5. `ContactMessage` Model (`models/ContactMessage.js`)
Inquiries sent via `/contact`.
- `name`: String (Required)
- `email`: String (Required)
- `phone`: String
- `subject`: String (Default: `'General Inquiry'`)
- `message`: String (Required)
- `status`: Enum `['unread', 'read', 'replied']` (Default: `'unread'`)

### 6. `Testimonial` Model (`models/Testimonial.js`)
Student reviews and testimonials displayed on the homepage.
- `studentName`: String (Required)
- `role`: String (e.g., `'Full Stack Trainee'`)
- `courseName`: String
- `content`: String (Required)
- `rating`: Number (1 to 5, default: 5)
- `avatar`: String
- `published`: Boolean (Default: `true`)

---

## 6. Interactive 3D Student Robotics System

The platform features an integrated **Three.js WebGL 3D CAD inspector** (`public/js/robot3dViewer.js` and `views/partials/robot3dModal.ejs`) that displays interactive, solid 3D models of 15 student robot builds across Levels 1, 2, and 3.

### Key Capabilities
1. **Interactive Orbit & Zoom**: Full 360-degree rotation and zoom with damping controls.
2. **Exploded Assembly Slider (0% to 100%)**: Dynamically displaces sub-assemblies (chassis plates, motors, sensor brackets, microcontrollers, and wiring) along their respective vectors.
3. **Wireframe / Solid Toggle**: Real-time material shader toggle between solid plastic/PCB textures and technical CAD wireframes.
4. **Auto-Spin Mode**: Automatic slow rotation for display presentation.
5. **Raycasting & Part Tooltips**: Hovering or clicking on individual components (e.g., L298N driver, HC-SR04 sonar, Arduino Uno board) displays technical specifications and part descriptions in an interactive overlay.
6. **Camera Reset**: Smooth reset to original perspective camera angle.

### Complete List of 15 Student Robot Presets

```
├── LEVEL 1: SENSOR ROBOTICS (L293N/L293D)
│   ├── 1. l1-line-following        (4-wheel acrylic chassis, TCRT5000 IR sensor array, cyan optical rays)
│   ├── 2. l1-obstacle-avoiding     (HC-SR04 ultrasonic sonar on SG90 servo turret + obstacle block)
│   ├── 3. l1-edge-avoiding         (Dual downward cliff IR sensors + table platform edge)
│   ├── 4. l1-wall-following        (Side-facing ultrasonic distance sonar + reference barrier)
│   └── 5. l1-object-following      (Front ultrasonic sonar + IR tracker + target blue cube)
│
├── LEVEL 2: BREADBOARD LOGIC & ROBOTICS
│   ├── 6. l2-line-following        (White solderless breadboard, discrete IR circuit, 7404 NOT, L293D)
│   ├── 7. l2-obstacle-avoiding     (Solderless breadboard, 7404 logic IC, L293D, ultrasonic sensor)
│   ├── 8. l2-edge-avoiding         (Breadboard discrete edge detector, cliff sensors, table edge)
│   ├── 9. l2-wall-following        (Breadboard logic gates, side distance sonar, wall barrier)
│   └── 10. l2-wireless-rc-car      (HT12D decoder IC, 433MHz RF receiver whip + Handheld RF Remote Unit)
│
└── LEVEL 3: CODING ROBOTICS WITH ARDUINO
    ├── 11. l3-line-following       (Arduino Uno R3 ATmega328P, L293D shield, 4-ch IR array, rainbow wiring)
    ├── 12. l3-obstacle-avoiding    (Arduino Uno R3, L293D shield, HC-SR04 on SG90 servo turret)
    ├── 13. l3-ir-remote-controlled (Arduino Uno R3, TSOP1838 IR module + Handheld IR Keyfob Remote)
    ├── 14. l3-bluetooth-controlled (Arduino Uno R3, HC-05 transceiver module + Smartphone Display)
    └── 15. l3-line-following-auto  (Heavy 4WD chassis, 5-ch IR array, optical wheel encoder disks, OLED screen)
```

---

## 7. HTTP Routes & API Endpoints

### Public Pages
- `GET /` — Homepage with hero banner, key statistics, featured projects, and testimonials.
- `GET /about` — Detailed about page with pedagogy, lab philosophy, and mentor background.
- `GET /courses` — Course catalogue (Robotics, Full Stack, and UI/UX).
- `GET /courses/:slug` — Individual course syllabus and level breakdown.
- `GET /projects` — Internal project showcase with filter by category.
- `GET /projects/:id` — Detailed project specification and 3D CAD inspector launch.
- `GET /contact` — Contact information, direct telephone links, address, and inquiry form.
- `POST /contact` — Submits contact inquiry (`ContactMessage` collection).
- `GET /register` — Course enrollment form with dynamic Level selection.
- `POST /register` — Processes course enrollment with duplicate submission validation.

### Authentication & Student Dashboard
- `GET /signup` — Student registration page.
- `POST /signup` — Account creation (supports secret `adminKey` to claim admin role).
- `GET /login` — Login page (email/password and Google OAuth).
- `POST /login` — Standard bcrypt password authentication.
- `GET /auth/google` — Initiates Google OAuth 2.0 flow.
- `GET /auth/google/callback` — Handles OAuth redirect, user creation/lookup, and session creation.
- `ALL /logout` — Destroys current session and redirects to home.
- `GET /profile` — *(Protected: Student)* Student dashboard with registration status list.
- `POST /profile/update` — *(Protected: Student)* Update name, phone, college, bio, and profile avatar.

### Administrator Control Center (Guarded by `isAdmin`)
- `GET /admin` — Executive dashboard metrics (total registrations, student counts, course breakdown).
- `GET /admin/registrations` — Searchable, filterable list of all course registrations.
- `POST /admin/registrations/:id/status` — Approve, reject, or mark registrations as pending.
- `GET /admin/projects` — Internal projects management table.
- `POST /admin/projects/create` — Creates a new project with image upload (`multer`).
- `POST /admin/projects/:id/toggle` — Toggles published/unpublished visibility.
- `POST /admin/projects/:id/delete` — Permanently removes a project record.
- `GET /admin/messages` — Inbox of contact form submissions.
- `POST /admin/messages/:id/read` — Marks an inquiry message as read.

---

## 8. Authentication & Authorization Details

1. **Session Handling**:
   - `express-session` configured with `MongoStore`.
   - Session duration: 24 hours (`ttl: 86400` seconds).
   - Cookies set with `httpOnly: true` and `secure: false` (allows HTTP in local development).
2. **Global View Context (`setUserContext`)**:
   - Every EJS template automatically receives:
     - `currentUser`: Populated from `req.session.user`
     - `isAdmin`: Boolean indicating administrator privileges
     - `currentPath`: Active URL path for highlighting active navbar items
     - `successMsg` / `errorMsg`: Flash toast notifications consumed from session
3. **Role-Based Access Control**:
   - `isLoggedIn`: Redirects unauthenticated requests to `/login`.
   - `isAdmin`: Validates `req.session.user.role === 'admin'`. Unauthorized users are redirected to `/`.
4. **Admin Account Creation**:
   - Signing up with an optional `adminKey` matching `process.env.ADMIN_KEY` grants the `'admin'` role.
   - Alternatively, the auto-seeder creates an admin automatically on startup.

---

## 9. Environment Variables Configuration

The `.env` file should contain the following settings:

```ini
# Server Port
PORT=5000

# MongoDB Connection String (Atlas or Local)
# If unavailable or offline, system automatically boots MongoMemoryServer
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/lti_courses?retryWrites=true&w=majority

# Session & Security
SESSION_SECRET=lti_courses_super_secret_key_2026
ADMIN_KEY=LTI_ADMIN_SECRET_2026

# Email / Nodemailer SMTP
EMAIL_SERVICE=gmail
EMAIL_USER=lti4official26@gmail.com
EMAIL_PASS=your_app_password_here

# Organization Contact Metadata
COMPANY_PHONE=9342988487
COMPANY_EMAIL=lti4official26@gmail.com

# Google OAuth 2.0 Credentials (Optional - can run without)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```

---

## 10. Getting Started & Operations

### Prerequisites
- Node.js (v18.x or later)
- npm (v9.x or later)
- MongoDB (Optional: if no local or Atlas URI is provided, an in-memory database will spin up automatically)

### Installation
```bash
# Clone the repository
git clone https://github.com/TAMILARASU25082006/lti_courses.git
cd lti_courses

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

### Running the Application
```bash
# Start in development mode (with Node.js --watch)
npm run dev

# Start in standard production mode
npm start

# Standalone manual database re-seed
npm run seed
```

### Default Credentials
- **Admin Email**: `admin@lticourses.com`
- **Admin Password**: `AdminPassword123!`
- **Admin Portal URL**: `http://localhost:5000/admin`
- **Student Signup**: `http://localhost:5000/signup`

---

## 11. Design System & UI Principles

- **Primary Colors**:
  - `primaryBlack`: `#080808` (Deep true black body background)
  - `darkCharcoal`: `#151515` (Modal, card, and secondary surfaces)
  - `cardBg`: `#16161a` (Elevated card containers)
  - `goldenYellow`: `#FFC928` (Primary brand accent, gold badges, buttons)
  - `goldHover`: `#ffd65c` (Interactive hover state)
  - `textGrey`: `#A0A0A0` (Readable secondary typographic color)
- **Typography**:
  - Headings: `Outfit`, sans-serif (Geometric, modern, technical)
  - Body Text: `Plus Jakarta Sans`, sans-serif (Highly legible, crisp)
- **Aesthetic Patterns**:
  - Glassmorphic panels with `backdrop-blur-md` and subtle borders (`border-white/10`).
  - Interactive hover state micro-animations on cards and buttons.
  - Fully responsive grid layouts accommodating mobile screens (hamburger drawer) through widescreen 4K displays.
