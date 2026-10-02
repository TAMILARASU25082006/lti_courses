require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/database');
const { setUserContext } = require('./middleware/authMiddleware');
const passport = require('./config/passport');

// Seed helper
const seedDataHelper = require('./utils/seedDataHelper');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Start Server Routine
const startServer = async () => {
  // 1. Connect Database
  await connectDB();

  // 2. Auto seed if needed
  await seedDataHelper();

  // 3. View Engine Setup (EJS)
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  // 4. Body Parser Middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // 5. Serve Static Files
  app.use(express.static(path.join(__dirname, 'public')));

  // 6. Session Configuration using current process.env.MONGODB_URI
  const activeMongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lti_courses';

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'lti_courses_super_secret_key_2026',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: activeMongoUri,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60
      }),
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: false,
        httpOnly: true
      }
    })
  );

  // 7. Passport Middleware Initialization
  app.use(passport.initialize());
  app.use(passport.session());

  // 8. Global User & Context Middleware
  app.use(setUserContext);

  // 9. Route Modules Integration
  const pageRoutes = require('./routes/pageRoutes');
  const courseRoutes = require('./routes/courseRoutes');
  const registrationRoutes = require('./routes/registrationRoutes');
  const authRoutes = require('./routes/authRoutes');
  const studentRoutes = require('./routes/studentRoutes');
  const projectRoutes = require('./routes/projectRoutes');
  const adminRoutes = require('./routes/adminRoutes');

  app.use('/', pageRoutes);
  app.use('/', courseRoutes);
  app.use('/', registrationRoutes);
  app.use('/', authRoutes);
  app.use('/', studentRoutes);
  app.use('/', projectRoutes);
  app.use('/', adminRoutes);

  // 404 Handler
  app.use((req, res) => {
    res.status(404).render('pages/error', { message: '404 - Page Not Found. The requested URL does not exist on LTI Courses.' });
  });

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error('[Server Error]:', err.stack);
    res.status(500).render('pages/error', { message: '500 - Internal Server Error' });
  });

  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 LTI_COURSES Server running with Tailwind & Google OAuth!`);
    console.log(`🌐 Website URL: http://localhost:${PORT}`);
    console.log(`🔑 Admin Account: admin@lticourses.com / AdminPassword123!`);
    console.log(`==================================================\n`);
  });
};

startServer();
