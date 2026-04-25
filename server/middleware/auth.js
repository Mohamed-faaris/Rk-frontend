import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'rajkayal_creative_hub_secret_key_2025';
const PRIVILEGED_ROLES = new Set(['admin', 'ceo']);

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('No token provided for route:', req.originalUrl);
      return res.status(401).json({ error: 'Not authorized to access this route - No token provided' });
    }

    console.log('Attempting to verify token with JWT_SECRET:', JWT_SECRET ? '(set)' : '(not set)');
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select('_id name role isActive isDeleted');

    if (!user || user.isDeleted || user.isActive === false) {
      return res.status(401).json({ error: 'Account is deleted or inactive' });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      role: user.role
    };
    console.log('User authenticated:', decoded.id, 'Role:', decoded.role, 'for route:', req.originalUrl);
    next();
  } catch (error) {
    console.log('Token verification failed for route:', req.originalUrl, 'Error:', error.message);
    return res.status(401).json({ error: 'Not authorized to access this route - Invalid token' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'User role is not authorized to access this route' });
    }
    next();
  };
};

// Admin middleware - shorthand for authorize('admin')
export const admin = (req, res, next) => {
  console.log('Privileged access check - User:', req.user, 'for route:', req.originalUrl);
  
  if (!req.user) {
    console.log('Admin check failed: No user object found');
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (!PRIVILEGED_ROLES.has(req.user.role)) {
    console.log('Privileged access denied for user:', req.user?.id, 'Role:', req.user?.role);
    return res.status(403).json({ error: 'Privileged access required' });
  }
  
  console.log('Privileged access granted for:', req.user.id, 'Role:', req.user.role);
  next();
};

export const strictAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

// Alternative exports for compatibility
export const authenticateToken = protect;
export const isAdmin = admin;
export const adminOnly = admin; // Additional alias
export const adminStrict = strictAdmin;
