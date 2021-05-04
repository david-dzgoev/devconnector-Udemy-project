import axios from 'axios';
import { setAlert } from './alert';

import { GET_PROFILE, PROFILE_ERROR } from './types';

//We want to call this as soon as we hit the dashboard route/load our dashboard component.
// Get current user's profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    //This route is going to know which profile to load based on the token we send in the universal headers for axios since the token IDs the user to the backend.
    //res.data here will contain the user's profile:
    const res = await axios.get('/api/profile/me');

    //call the GET_PROFILE reducer and pass in the returned user's profile
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      //Send an object with a message containing any errors encountered from above like from making the axios request.
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create or update profile
// edit parameter is false by default
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    //We're making a post request to api/profile which allows you to create or update a profile
    const res = await axios.post('/api/profile', formData, config);

    //call the GET_PROFILE reducer and pass in the returned user's profile
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    //pass in the type of success to make the alert green here:
    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

    //If we edit, stay on page, if creating, redirect to /dashboard
    // We cannot redirect from an action by using <Redirect> tag, we have to pass in the history object which has a push method on it to redirect from an action.
    if (!edit) {
      history.push('/dashboard');
    }
  } catch (err) {
    //remember the errors array was called errors
    const errors = err.response.data.errors;

    //For instance if we forget the status or the skills or whatever:
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: PROFILE_ERROR,
      //Send an object with a message containing any errors encountered from above like from making the axios request.
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
