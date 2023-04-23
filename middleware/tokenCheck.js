const jwt = require('jsonwebtoken');

const User = require('../models/usersModel');

exports.protect = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.startsWith('Bearer') &&
      req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        Status: '401 Unauthorized',
        ContentType: 'application/json',
        ResponseBody: {
          message: 'Not authorized',
        },
      });
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decodedToken.id);

    if (!currentUser) {
      return res.status(401).json({
        Status: '401 Unauthorized',
        ContentType: 'application/json',
        ResponseBody: {
          message: 'Not authorized',
        },
      });
    }

    req.user = currentUser;

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
