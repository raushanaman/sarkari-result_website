const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const actualToken = token.replace('Bearer ', '');

    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    
    // Handle environment admin
    if (decoded.id === 'env-admin') {
      req.admin = { 
        id: 'env-admin', 
        username: process.env.ADMIN_USERNAME 
      };
      return next();
    }
    
    // Handle database admin
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;