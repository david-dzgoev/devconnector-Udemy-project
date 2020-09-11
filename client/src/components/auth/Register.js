import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
//import axios from 'axios'; (commented out because don't need it since we'll be doing this with redux action later on.)

export const Register = ({ setAlert, register }) => {
  //formData/first thing here is basically the state/an object with all of our state values
  //setFormData/second thing here is basically this.setState/a function to update the state
  //For default state values you put 'em in the useState
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  //in setFormData we want to change the state above. So we pass in an object with a copy of formData using spread operator to make a copy of it because we only want to change one thing.
  //...formData is spread operator that just copies what is in there. Since we pass in the name and its value again after copying the name is already, the second piece in the object overwrites the first piece
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  //We need to preventDefault because it is submit
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      //msg,             alertType
      setAlert('Passwords do not match', 'danger');
    } else {
      //register action takes an object with name email and password and we can access these because we are pulling/destructuring them out of this component's state above.
      register({ name, email, password });
      //The below code is commented out because we will be doing it with a redux action later on rather than inside the component:
      //Redux is app level data that holds user data, profile data, and alerts. Think of it as a cloud of data (the store) that hovers over your app where you can access or udpate the data from anywhere. Once you make a call to the DB and get a response back, you submit an action based on the response to the reducer which decides how and what to update and then the reducer rains the data down into the components automatically. We can call the redux actions from any component.
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
          {/*We want to associate this name input with the name in the state */}
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={(e) => onChange(e)}
            //required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
            //required
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
            //minLength='6'
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={(e) => onChange(e)}
            //minLength='6'
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

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
};
//connect method (which connects this component to Redux) takes in two things:
//First is any state you want to map. The second is an object with any action you want to use which allows you to do props dot that action.
//We have to add the setAlert action in the export in order to be able to use it in the component, and then it is available in props.
export default connect(null, { setAlert, register })(Register);
