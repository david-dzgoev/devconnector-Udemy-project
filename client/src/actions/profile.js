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
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      //Send an object with a message containing any errors encountered from above like from making the axios request.
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
