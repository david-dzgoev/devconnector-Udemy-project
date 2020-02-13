const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private

//Since it's mongoose it returns a promise so we add async
router.get('/me', auth, async (req, res) => {
  try {
    //We want to bring in the name and avatar field from user but it isn't on the user object so we can use .populate method to bring them in.
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //We want to pull all of the fields out from the req body
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //We need to make sure certain fields were actually aded before we try to add this to the DB
    //Build profile object
    const profileFields = {};
    //Now lets go one by one and add each field.
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build social object. If we don't initialize the object like this it's going to tell us it can't find undefined of social
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    //Now we're ready to actually update and insert the data.

    try {
      //req.user.id comes from the token
      let profile = await Profile.findOne({ user: req.user.id });

      //if there is a profile we want to update it and send back the entire profile
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        //I want to return the entire profile
        return res.json(profile);
      }

      //Create a profile if a profile is not found
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   Get api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   Get api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status('400').json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status('400').json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // @todo - remove users posts
    //Remove profile associated to the user
    await Profile.findOneAndRemove({ user: req.user.id });

    //Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('company', 'Company is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //We're going to need some validation here, because on the frontend in react we're gonna have a form to add an experience. 'title', 'company' and 'from date' are all gonna be required.
    const errors = validationResult(req);
    //Check if we have any errors
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Now we want to get the body data out of req.body, so we do some destructuring to pull some stuff out.
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    //This will create an object with the data that the user submits.
    const newExp = {
      //same thing as 'title = title,'
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      //Get the requesting user's profile from the DB by the user's id from the token
      const profile = await Profile.findOne({ user: req.user.id });

      //profile.experience is going to be an array. Unshift is the same as push but it pushes onto the beggining such that the most recent are first.
      profile.experience.unshift(newExp);

      //takes the profile object which represents the document we retireved from the DB, and saves the changes that made to it back into the DB.
      await profile.save();

      //As a response we just return the whole profile which is going to help us with the profile later on.
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    //Get the requesting user's profile from the DB by the user's id from the token
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index. In the indexOf, we want to match whatever :exp_id is
    //indexOf method returns the position (array specific I guess?) of the first occurence of a specific value
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    //splice takes stuff out of an array at index removeIndex and 1 thing. So this removes the experience at spot removeIndex which is the experience has id equal to the id passed into this route.
    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required')
        .not()
        .isEmpty(),
      check('degree', 'Degree is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Field of study is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //We're going to need some validation here, because on the frontend in react we're gonna have a form to add an experience. The above fields are all gonna be required.
    const errors = validationResult(req);
    //Check if we have any errors
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Now we want to get the body data out of req.body, so we do some destructuring to pull some stuff out.
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    //This will create an object with the data that the user submits.
    const newEdu = {
      //same thing as 'school = school,'
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      //Get the requesting user's profile from the DB by the user's id from the token
      const profile = await Profile.findOne({ user: req.user.id });

      //profile.education is going to be an array. Unshift is the same as push but it pushes onto the beggining such that the most recent are first.
      profile.education.unshift(newEdu);

      //takes the profile object which represents the document we retireved from the DB, and saves the changes that made to it back into the DB.
      await profile.save();

      //As a response we just return the whole profile which is going to help us with the profile later on.
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    //Get the requesting user's profile from the DB by the user's id from the token
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index. In the indexOf, we want to match whatever :edu_id is
    //indexOf method returns the position (array specific I guess?) of the first occurence of a specific value
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    //splice takes stuff out of an array at index removeIndex and 1 thing. So this removes the education at spot removeIndex which is the education has id equal to the id passed into this route.
    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      //If its not a 200 response let's send back a 404 error and say profile isn't found
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' });
      }
      //If profile is found, send back the body which is just going to be a regular string with escaped quotes and stuff like that, so we want to surround that with json.parse before we send it.
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
