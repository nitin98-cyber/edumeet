// ========================================
// Authentication Middleware
// ========================================

// Check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.status(401).json({ 
        success: false, 
        message: 'Please login to continue' 
    });
};

// Check if user is student
const isStudent = (req, res, next) => {
    if (req.session && req.session.userType === 'student') {
        return next();
    }
    return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Students only.' 
    });
};

// Check if user is faculty
const isFaculty = (req, res, next) => {
    if (req.session && req.session.userType === 'faculty') {
        return next();
    }
    return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Faculty only.' 
    });
};

// Check if user is admin
const isAdmin = (req, res, next) => {
    if (req.session && req.session.userType === 'admin') {
        return next();
    }
    return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admins only.' 
    });
};

module.exports = {
    isAuthenticated,
    isStudent,
    isFaculty,
    isAdmin
};
