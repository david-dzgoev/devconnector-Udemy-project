import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE } from '../actions/types';

//We're gonna have actions to get the profile, create it, update it, clear it from the state, etc.
const initialState = {
  //When we log in, a request is going to be made to put that current user's profile data in here:
  profile: null,
  //This is for the profile listing page where there's a list of developers:
  profiles: [],
  repos: [],
  loading: true,
  //For any errors in the request:
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        //Set the profile as the payload which is the user's profile that was passed into the GET_PROFILE action
        profile: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        //Set the error object as the payload which is any errors that were passed into the GET_PROFILE action
        error: payload,
        loading: false,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        //Set profile back to null. Also set the repos to null because the profile could have repos.
        profile: null,
        repos: null,
      };
    default:
      return state;
  }
}
