//This is the alert reducer. It's just a function that takes in a piece of state (any state that has to do with alerts) and an action. An action is going to get dispatched from an actions file.
import { SET_ALERT, REMOVE_ALERT } from '../actions/types';
const initialState = [
  //This is just an empty array but this is what it would look like (as well as what the payload would look like):
  //   {
  //     id: 1,
  //     msg: 'Please log in',
  //     //using this alertType, in our alert component we can look at this and decide what color it will be, red for error, etc.
  //     alertType: 'success',
  //   },
  //   {}
];

//the action is going to contain a mandatory type, and a payload which will be the data. Sometimes you will have no data. The type is what we need to evaluate/switch on.
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    //add an alert
    case SET_ALERT:
      //depending on the type, we need to decide what do we return down as the state. For the state, return an array. State is immutable so we have to include any other state that is already there so use '...state' to copy what is already there, and then add our new alert. The data will be inside a payload object. The payload will have a msg, id, and alertType like above.
      return [...state, payload];
    //Here we want to remove a specific alert by its ID:
    case REMOVE_ALERT:
      //payload in this case will just be the id.
      //filter here will return all alerts except for those whose id matches the payload.
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}
