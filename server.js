require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const { setUserContext } = require('./middleware/authMiddleware');
const passport = require('./config/passport');
const seedDataHelper = require('./utils/seedDataHelper');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;

// 1. View Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Body Parser Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3. Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// 4. Session Configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'lti_courses_super_secret_key_2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: false,
    httpOnly: true
  }
};

// Use MongoStore if a real external MongoDB URI (e.g. MongoDB Atlas) is configured
const activeMongoUri = process.env.MONGODB_URI;
if (activeMongoUri && activeMongoUri.startsWith('mongodb') && !activeMongoUri.includes('127.0.0.1')) {
  try {
    sessionConfig.store = MongoStore.create({
      mongoUrl: activeMongoUri,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60,
      autoRemove: 'native'
    });
    console.log('✔ Session store connected to MongoDB Atlas.');
  } catch (err) {
    console.warn('[Session Warning]: Falling back to in-memory session store.');
  }
}

app.use(session(sessionConfig));

// 5. Passport Middleware Initialization
app.use(passport.initialize());
app.use(passport.session());

// 6. Global User & Context Middleware
app.use(setUserContext);

// 7. Auto DB & Seed Connection Middleware (Serverless & Cold Start Support)
let isDbInitialized = false;
app.use(async (req, res, next) => {
  if (!isDbInitialized) {
    try {
      await connectDB();
      if (mongoose.connection.readyState === 1) {
        await seedDataHelper();
      }
      isDbInitialized = true;
    } catch (err) {
      console.error('[Database Middleware Error]:', err.message);
    }
  }
  next();
});

// 8. Route Modules Integration
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
  console.error('[Server Error]:', err.stack || err);
  res.status(500).render('pages/error', { message: '500 - Internal Server Error' });
});

// Start local server if not running in Vercel serverless environment
if (!process.env.VERCEL) {
  connectDB().then(() => {
    seedDataHelper();
  }).catch((err) => {
    console.error('[Init DB Error]:', err.message);
  });

  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 LTI_COURSES Server running!`);
    console.log(`🌐 Website URL: http://localhost:${PORT}`);
    console.log(`🔑 Admin Account: admin@lticourses.com / AdminPassword123!`);
    console.log(`==================================================\n`);
  });
}

// Export app for Vercel Serverless Functions
module.exports = app;
