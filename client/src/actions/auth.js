import axios from 'axios';
//We can call this from anywhere.
import { setAlert } from './alert';
import { REGISTER_SUCCESS, REGISTER_FAIL } from './types';

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
    const res = await axios.post('/api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      //res.data here because this request gives back a token on a successful reponse.
      payload: res.data,
    });
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
