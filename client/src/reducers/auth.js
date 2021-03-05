import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from '../actions/types';

//initialState is going to be an object instead of an array like in alert
const initialState = {
  //We're going to store the token in local storage which we can access using vanilla javaScript. Look for an item called token in localStorage, and set it to token if it's there. This is going to be the default for token.
  token: localStorage.getItem('token'),
  //We're going to set to null by default, but what will happen is when we make a request to login or register and it succeeds, we will set this to true. This is the value we check to make the navbar have stuff that only logged in users can see like "log out"
  isAuthenticated: null,
  //We want to make sure that when we load a user or something to see if they are authenticated, we want to make sure that the loading is done AKA that we already made a request to the backend and got a response. This will be true by default and we will set it to false once we get a response back from the backend.
  loading: true,
  //Once we make request to api/auth and get user data back from backend including name, email, etc, they will go here.
  user: null,
};

//Takes in two things, the state, and the action that is going to get dispatched.
//The reason we do state = initialState is so that we do not have to declare the initialState in the function call here, to make it neater.
//payload is just the token here.
export default function (state = initialState, action) {
  //take out the type and payload (payload is an object) from the action here:
  const { type, payload } = action;

  switch (type) {
    //token was validated and we got the user so we send the user in the payload here
    case USER_LOADED:
      return {
        ...state,
        //token was validated and we got the user
        isAuthenticated: true,
        loading: false,
        //payload is the user
        user: payload,
      };
    //This means we successfully got the token back and we want to the user to be logged in right away
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      //We want to put the token that is returned inside local storage. It's payload.token here because payload is an object.
      localStorage.setItem('token', payload.token);
      //The state we want to return has whatever is currently in the state, also we are going to return the payload. Set isAuthenticated to true and loading set to false because these cases mean we got a response.
      return {
        //get whatever is currently in the state
        ...state,
        //I think payload is an oject of { token: ewrer42342etc} here. So token in the state gets set to the token
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    //These cases clear all the auth related app state, and it clears the token from local storage. Basically we do not want to have a token that is invalid in local storage ever.
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      //If registration or logging in fails, or we want to logout, we want to remove the token completely form local storage and from the app state.
      //If there is no token in local storage when a User is attempted to be loaded, we want to remove the token completely form local storage and from the app state.
      localStorage.removeItem('token');
      //We return a state
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
}
