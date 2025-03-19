
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Authentication middleware
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from headers
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const connection = db.getConnection();
    const [users] = await connection.execute(
      'SELECT id, email FROM users WHERE id = ?',
      [decoded.id]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Attach user to request
    req.user = {
      id: users[0].id,
      email: users[0].email
    };
    
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Authentication error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Role-based authorization middleware
exports.authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  
  return async (req, res, next) => {
    try {
      // User must be authenticated first
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      // If no roles are required, allow access
      if (roles.length === 0) {
        return next();
      }
      
      // Get user roles from database
      const connection = db.getConnection();
      const [userRoles] = await connection.execute(
        'SELECT role FROM user_roles WHERE user_id = ?',
        [req.user.id]
      );
      
      // Check if user has any of the required roles
      const hasRole = userRoles.some(userRole => 
        roles.includes(userRole.role)
      );
      
      if (!hasRole) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      next();
    } catch (err) {
      console.error('Authorization error:', err);
      res.status(500).json({ error: 'Authorization failed' });
    }
  };
};
