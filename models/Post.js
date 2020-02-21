const mongoose = require('mongoose');
//Gonna create a variable called Schema so that later on we can say Schema instead of mongoose.Schema
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  //We want posts to be connected to a user so we create a reference to a user
  user: {
    type: Schema.Types.ObjectId,
    //Reference the users model
    ref: 'users'
  },
  text: {
    type: String,
    required: true
  },
  //This is the name of the user. Reason we are doing this is that we want the possibility to keep posts even if a user is deleted. So we won't have to dig into the users collection in that case
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    //This will be an array of user objects that will have users ids and like ids in them
    {
      //This way we know which likes came from which user. A single user can only like a certain post once
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  comments: [
    //This will be an array of user objects that will have ids
    {
      //This way we know which comments came from which user.
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    //This is the date on the actual post itself.
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model('post', PostSchema);
