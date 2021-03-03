import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

export const Login = ({ login, isAuthenticated }) => {
  //formData is basically an object with all of our state values
  //setFormData is a function to update the state
  //For default state values you put 'em in the useState
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  //in setFormData we want to change the state above. So we pass in an object with a copy of formData using spread operator to make a copy of it because we only want to change one thing.
  //...formData is spread operator that just copies what is in there. Since we pass in the name and its value again after copying the name is already, the second piece in the object overwrites the first piece
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  //We need to preventDefault because it is submit
  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  // Redirect if logged in
  if (isAuthenticated) {
    //React router allows you to do Redirect and add a 'to' prop. Need to import the Redirect.
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign Into Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => onChange(e)}
            minLength='6'
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Login' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </Fragment>
  );
};

//You can pull these from the props of Login.js now:
Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

//mapStateToProps gets called here with the app level state as an argument.
const mapStateToProps = (state) => ({
  //The below would give us all of the state in the auth reducer, but we don't need all of the state in the auth reducer.
  //auth: state.auth

  //isAuthenticated is a prop here.
  isAuthenticated: state.auth.isAuthenticated,
});

//connect method (which connects this component to Redux) takes in two things:
//First is any state you want to map. The second is an object with any action you want to use which allows you to do props dot that action.
//We have to add the login action in the export in order to be able to use it in the component, and then it is available in props.
//mapStateToProps gets called here with the app level state as an argument.
export default connect(mapStateToProps, { login })(Login);
