const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    console.log('Token received:', token);

    if (!token) {
      return res.status(401).send('Token not provided');
    }

    const payload = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ email: payload.email });

    if (!user) {
      return res.status(400).send('Invalid token: User not found');
    }

    res.locals.user = user;
    next();
  } catch (error) {
    console.error('Error in checkAuth middleware:', error);
    return res.status(400).send(`Invalid token: ${error.message}`);
  }
};

const checkAdmin = (req, res, next) => {
  if (res.locals.user.role === 'admin') {
      next()
  } else {
      return res.status(401).send('Unauthorized')
  }
}

module.exports = {
  checkAuth,
  checkAdmin
}
