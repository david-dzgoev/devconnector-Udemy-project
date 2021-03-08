//This is the rootReducer
//We are going to have multiple reducers but we are going to use combineReducers to consolidate them
import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';

//combineReducers just takes in an object that will have any reducers that we create.
export default combineReducers({ alert, auth, profile });
