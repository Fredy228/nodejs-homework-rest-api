const express = require('express');

const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const User = require('../../models/usersModel');
const tokenCheck = require('../../middleware/tokenCheck');
const { sendEmail } = require('../../services/email');

const router = express.Router();

const schemaUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/)
    .required(),
  subscription: Joi.string().valid('starter', 'pro', 'business'),
  verificationToken: Joi.string().required(),
});

const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

router.post('/register', async (req, res, next) => {
  try {
    const newUserData = {
      ...req.body,
      subscription: 'starter',
      verificationToken: uuidv4(),
    };

    const isValid = schemaUser.validate(newUserData);

    if (isValid.error) {
      return res.status(400).json({
        Status: '400 Bad Request',
        ContentType: 'application/json',
        ResponseBody: isValid.error,
      });
    }

    if (await User.findOne({ email: newUserData.email })) {
      return res.status(409).json({
        Status: '409 Conflict',
        ContentType: 'application/json',
        ResponseBody: {
          message: 'Email in use',
        },
      });
    }

    const newUser = await User.create(newUserData);

    const token = signToken(newUser.id);
    newUser.token = token;
    newUser.save();

    sendEmail(newUser.email, newUser.verificationToken);

    res.status(200).json({
      Status: '200 OK',
      ContentType: 'application/json',
      ResponseBody: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          token,
        },
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    const isValid = schemaUser.validate({ email, password });

    if (isValid.error) {
      return res.status(400).json({
        Status: '400 Bad Request',
        ContentType: 'application/json',
        ResponseBody: isValid.error,
      });
    }

    if (!user) {
      return res.status(401).json({
        Status: '401 Unauthorized',
        ResponseBody: {
          message: 'Email or password is wrong',
        },
      });
    }

    const passwordIsValid = await user.checkPassword(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        Status: '401 Unauthorized',
        ResponseBody: {
          message: 'Email or password is wrong',
        },
      });
    }

    const token = signToken(user.id);
    user.token = token;
    user.save();

    res.status(200).json({
      Status: '200 OK',
      ContentType: 'application/json',
      ResponseBody: {
        user: {
          email: user.email,
          subscription: user.subscription,
          token,
        },
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/logout', tokenCheck.protect, async (req, res, next) => {
  try {
    req.user.token = null;
    req.user.save();

    res.status(204).json({
      Status: '204 No Content',
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/verify/:verificationToken', async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    console.log(verificationToken);
    if (!verificationToken)
      return res.status(400).json({ message: 'Not found verification token' });

    const userFind = await User.findOne({ verificationToken });

    console.log(userFind);

    if (!userFind) return res.status(400).json({ message: 'User not found' });

    userFind.verificationToken = 'null';
    userFind.verify = true;
    userFind.save();
    console.log(userFind);
    res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error...' });
  }
});

router.post('/verify', async (req, res, next) => {
  const { email } = req.body;
  const userFind = await User.findOne({ email });

  if (!email)
    return res.status(400).json({ message: 'missing required field email' });

  if (!userFind) return res.status(400).json({ message: 'User not found' });

  if (userFind.verify)
    return res
      .status(400)
      .json({ message: 'Verification has already been passed' });

  sendEmail(userFind.email, userFind.verificationToken);
});

module.exports = router;
