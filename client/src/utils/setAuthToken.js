//function that takes in a token, if the token is there, add it to the global headers, if it is not there, delete it from the global headers
//We're not making a request with axios, we're just making a global header.
import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
