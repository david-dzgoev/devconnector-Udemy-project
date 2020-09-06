import uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

//we want to be able to dispatch more than one actionType from this function right here. So we have something called dispatch that we can add. We are able to do that => (dispatch) => {} because of our thunk middleware.
//We are going to call this setAlert action from our alert component
export const setAlert = (msg, alertType) => (dispatch) => {
  //this just gives us a random long string
  const id = uuid.v4();
  //calling dispatch here sends an object containing the type and payload to the alert reducer (called action in the reducer). This also apparently returns the state that the reducer returns?
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });
};
