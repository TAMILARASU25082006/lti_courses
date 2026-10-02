module.exports = {
  // Pass user session data to all EJS views
  setUserContext: (req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    res.locals.isAdmin = req.session.user && req.session.user.role === 'admin';
    res.locals.currentPath = req.path;
    res.locals.successMsg = req.session.successMsg || null;
    res.locals.errorMsg = req.session.errorMsg || null;
    delete req.session.successMsg;
    delete req.session.errorMsg;
    next();
  },

  // Require logged in user
  isLoggedIn: (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    }
    req.session.errorMsg = 'Please log in to access this page.';
    return res.redirect('/login');
  },

  // Require admin role
  isAdmin: (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
      return next();
    }
    req.session.errorMsg = 'Access denied: Administrator privileges required.';
    return res.redirect('/');
  }
};
