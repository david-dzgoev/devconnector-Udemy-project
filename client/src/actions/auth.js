import axios from 'axios';
//We can call this from anywhere.
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from './types';
import setAuthToken from '../utils/setAuthToken';

//Load User
export const loadUser = () => async (dispatch) => {
  //We want to check if there is a token in localStorage, and if there is, put it in a global header. If we have a token in local storage, we want to just always send that. Let's create a new file to do this: setAuthToken.js
  //This will only check the first time the user loads.
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    //We send this get method the token that we have in local storage (if we have one)
    //This route checks to see if we're logged in or not by verifying the token, and if so, returns the user's data back from the database.
    const res = await axios.get('/api/auth');

    //Main things this does is to set the app state's isAuthenticated value to true, and adds the user to the app state.
    dispatch({
      type: USER_LOADED,
      //Send the User in the payload
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User action
//We're using async await here so that goes before dispatch.
//This function takes in an object with name, email, and passord
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  //prepare data to send as the body
  const body = JSON.stringify({ name, email, password });

  try {
    //Call the register a user route. res will contain a token if the call is successful
    const res = await axios.post('/api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      //res.data here because this request gives back a token on a successful reponse. I think payload is an oject of { token: ewrer42342etc} here.
      payload: res.data,
    });

    //Putting loadUser here so that it runs immediately.
    dispatch(loadUser());
    //If there is an error making /api/users request, remember that we get back an array of errors. So we want to loop through those.
  } catch (err) {
    //remember the errors array was called errors
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL,
      //We only need to dispatch the type - we don't need a payload because REGISTER_FAIL doesn't do anything with the payload.
    });
  }
};

// Login User action
//We're using async await here so that goes before dispatch.
//This function takes in an email and password
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  //prepare data to send as the body
  const body = JSON.stringify({ email, password });

  try {
    //Call the login a user route. res will contain a token if the call is successful AKA if the email and password passed in match an entry in the user collection in the database
    const res = await axios.post('/api/auth', body, config);

    //If the axios call is successful:
    dispatch({
      type: LOGIN_SUCCESS,
      //res.data here because this request gives back a token on a successful reponse. I think payload is an oject of { token: ewrer42342etc} here.
      payload: res.data,
    });

    //Putting loadUser here so that it runs immediately.
    dispatch(loadUser());
    //If there is an error making /api/auth request, remember that we get back an array of errors. So we want to loop through those.
  } catch (err) {
    //remember the errors array was called errors
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL,
      //We only need to dispatch the type - we don't need a payload because LOGIN_FAIL doesn't do anything with the payload.
    });
  }
};
