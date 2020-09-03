import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

export const Login = () => {
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
    console.log('SUCCESS');
  };

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

export default Login;
