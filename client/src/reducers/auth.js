import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types';

//initialState is going to be an object instead of an array like in alert
const initialState = {
  //We're going to store the token in local storage which we can access using vanilla javaScript. Look for an item called token in localStorage. This is going to be the default for token.
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
export default function (state = initialState, action) {
  //take out the type and payload (payload is an object) from the action here:
  const { type, payload } = action;

  switch (type) {
    //This means we get to the token back and we want to the user to be logged in right away
    case REGISTER_SUCCESS:
      //We want to put the token that is returned inside local storage
      localStorage.setItem('token', payload.token);
      //The state we want to return has whatever is currently in the state, also we are going to return the payload. Set isAuthenticated to true and loading set to false because REGISTER_SUCCESS means we got a response.
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
      //If failed login we want to remove the token completely.
      localStorage.removeItem('token');
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
