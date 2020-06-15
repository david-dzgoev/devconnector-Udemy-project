import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
//import axios from 'axios'; (commented out because don't need it since we'll be doing this with redux action later on.)

export const Register = () => {
  //formData is basically an object with all of our state values
  //setFormData is a function to update the state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  //...formData is spread operator that just copies what is in there.
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      console.log('Passwords do not match');
    } else {
      console.log('SUCCESS');
      //The below code is commented out because we will be doing it with a redux action later on:
      //   //create new user object that uses the component's state data
      //   const newUser = {
      //     name: name,
      //     email: email,
      //     password: password,
      //   };

      //   try {
      //     const config = {
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //     };

      //     //convert newUser object into JSON string
      //     const body = JSON.stringify(newUser);

      //     //axios returns a promise
      //     const res = await axios.post('/api/users', body, config);
      //     console.log(res.data);
      //   } catch (err) {
      //     console.error(err.response.data);
      //   }
      // }
    }
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
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
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={(e) => onChange(e)}
            minLength='6'
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

export default Register;
