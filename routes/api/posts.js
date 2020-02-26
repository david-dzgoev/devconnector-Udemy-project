const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   POST api/posts
// @desc    Create a post
// @access  Private because you have to be logged in to create a post
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //The reason we're getting the user is so that we can get the name, the avatar, and the user itself. The model of the post has a user itself in the post, we also need to name and avatar. These fields are going to come from the DB as it is not something we are sending with the request.
      //We don't want to send the password back so do the .select
      const user = await User.findById(req.user.id).select('-password');

      //new object for a post
      const newPost = new Post({
        text: req.body.text,
        //the rest of this stuff comes from the user
        name: user.name,
        avatar: user.avatar,
        //user object in post model is a user's id
        user: req.user.id
      });

      //So that we have the saved post object in an object so that we can send it as a response.
      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
// Profiles are public but posts are not
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); //date: -1 does most recent posts first
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Private
// Profiles are public but posts are not
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //We want to check if there is a post with that ID
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    //if err type is ObjectId it means its not a formatted object id which means there won't be a post found
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //We should handle if the post does not exist
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    //We need to make sure that the user deleting the post is the user that owns the post.
    //So check user. We want to check to see if the user is not equal to the req.user.id
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    //if err type is ObjectId it means its not a formatted object id which means there won't be a post found
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
// PUT request because we technically updating a post. We need to know the id of the post that is being liked. When a
// post is liked, we add the user that liked it to the likes array of the post.
router.put('/like/:id', auth, async (req, res) => {
  try {
    //fetch the post from the DB here
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked by this user
    if (
      //filter only returns something if the function evaluates to true. If the length of the returned thing is <0 it means there is already a like for that user.
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    //If the user hasn't already liked the post then we want to take the post's likes and add the like to it. Unshift just adds the item to the front of the array. We are passing in a 'user' object that contains the user's ID because that is what the post schema demands.
    post.likes.unshift({ user: req.user.id });

    //actually saves the changes to the post object back into the database.
    await post.save();

    //we're returning an array of all of the likes for the post because the frontend logic requires it.
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    //fetch the post from the DB here
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked by this user because we can't unlike a post that we havn't already liked
    if (
      //filter only returns something if the function evaluates to true. If the length of the returned things is 0, it means nothing was rteurned that passed the criteria function so there is already a like for that user.
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }
    //If the user has already liked the post then we want to take the post's likes and remove the like from it.
    //Get remove index (similar to what we did with experience and education) AKA get the correct like to remove
    const removeIndex = post.likes //map means return a new array with the results of calling the provided functin on every element in the calling array. So that means it returns a list of the like's user's ids
      .map(like => like.user.toString())
      .indexOf(req.user.id); //.indexOf will find the index in the array of the item that matches req.user.id which is the logged in user that came from the auth middleware.
    //Now we need to splice this like to remove out of the likes array at position removeIndex
    post.likes.splice(removeIndex, 1);

    //actually saves the changes to the post object back into the database.
    await post.save();

    //we're returning an array of all of the likes for the post because the frontend logic requires it.
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post(
  '/comment/:id',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //The reason we're getting the user is so that we can get the name, the avatar, and the user itself. The model of the post has a user itself in the post, we also need to name and avatar. These fields are going to come from the DB as it is not something we are sending with the request.
      //We don't want to send the password back so do the .select
      const user = await User.findById(req.user.id).select('-password');

      //get the post from the post's id in the request
      const post = await Post.findById(req.params.id);

      //new object for a comment
      const newComment = {
        text: req.body.text,
        //the rest of this stuff comes from the user
        name: user.name,
        avatar: user.avatar,
        //user object in post model is a user's id
        user: req.user.id
      };

      //Now we can add this comment to the post's comments array
      post.comments.unshift(newComment);

      await post.save();

      //send back all the comments
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment on a post
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    //get the post from the post's id in the request
    const post = await Post.findById(req.params.id);

    //Get the comment from the post with the comment's id in the request.
    //The find method takes in a function like forEach, map, filter, etc. It only returns only one element if it passes the function so this will give us either the comment if it exists, or false.
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    //make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    //We need to make sure that the user deleting the comment is the user that made the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    //if everything is ok lets move along
    //We want to find the index

    //If the user has already comented on the post then we want to take the post's comment and remove the comment from it.
    //Get remove index (similar to what we did with experience and education) AKA get the correct comment to remove
    const removeIndex = post.likes //map means return a new array with the results of calling the provided functin on every element in the calling array. So that means it returns a list of the comments's user's ids
      .map(comment => comment.user.toString())
      .indexOf(req.user.id); //.indexOf will find the index in the array of the item that matches req.user.id which is the logged in user that came from the auth middleware.
    //Now we need to splice this like to remove out of the likes array at position removeIndex
    post.comments.splice(removeIndex, 1);

    //actually saves the changes to the post object back into the database.
    await post.save();

    //we're returning an array of all of the comments for the post because the frontend logic requires it.
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
