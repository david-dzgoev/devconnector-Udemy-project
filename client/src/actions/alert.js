import uuid from 'uuid/v4';
import { SET_ALERT, REMOVE_ALERT } from './types';

//we want to be able to dispatch more than one actionType from this function right here. So we have something called dispatch that we can add. We are able to do that => (dispatch) => {} because of our thunk middleware.
//We are going to call this setAlert action from our alert component
export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  //this just gives us a random long string
  const id = uuid();
  //calling dispatch here sends an object containing the type and payload to the alert reducer (called action in the reducer). This will add the alert to the state. This also apparently returns the state that the reducer returns?
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  //Takes a function as the first argument to be called after the amount of time in the second argument passes (5000 = five seconds)
  setTimeout(
    () =>
      dispatch({
        type: REMOVE_ALERT,
        payload: id,
      }),
    timeout
  );
};
