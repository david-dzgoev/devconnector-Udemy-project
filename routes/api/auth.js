const express = require('express');
const router = express.Router();
const bycrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Get authenticated user
// @access  Public
router.get('/', auth, async (req, res) => {
  //If I have my token and I hit this route, I get back all of the user data.
  //So what we're going to do in React is constantly make a request with token if we're authenticated and we're going to fill the application state with the user value with the user object in it so that we know which user is logged in at all times.
  try {
    //Don't want to return the password here hence the .select
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    //Just checking for errors in the body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //req.body isn't going to have name, just email and password
    const { email, password } = req.body;

    try {
      //Get User from DB by email passed in from the body
      let user = await User.findOne({ email });
      //We want to check if there isn't a user, and if there isn't, we want to send back an error.
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      //We need to match the user's email and password. We have this user that's found but we need to make sure that the password matches.
      //bcrypt has a method called compare which takes a plantext password and an encrypted password and tells you if they're a match or not.
      const isMatch = await bycrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Create payload that contains user's id
      const payload = {
        user: {
          id: user.id
        }
      };

      //Return jsonwebtoken adding the payload that contains the user's id.
      // This creates and encrypts a token using the given payload and jwtSecret respectively and returns it in the response
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
