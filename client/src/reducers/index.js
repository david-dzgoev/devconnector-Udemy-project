//We are going to have multiple reducers but we are going to use combineReducers to consolidate them
import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';

//combineReducers just takes in an object that will have any reducers that we create.
export default combineReducers({ alert, auth });
