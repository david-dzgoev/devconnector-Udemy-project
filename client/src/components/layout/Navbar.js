import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
//We want to connect to redux and bring in some auth State:
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

//take out loading here because we want to make sure the user is done loading before we put the links in:
const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  //the {' '} below just adds a space between the icon and "Logout":
  const authLinks = (
    <ul>
      <li>
        <Link to='/dashboard'>
          <i className='fas fa-user'></i>{' '}
          <span className='hide-sm'>Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} href='#!'>
          <i className='fas fa-sign-out-alt'></i>{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  );

  //href #! has the link go nowhere:
  const guestLinks = (
    <ul>
      <li>
        <a href='#!'>Developers</a>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code'></i> DevConnector
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

//We're going to bring in the entire auth state (whatever the state is of the auth.js reducer):
//The argument "state" here represents the redux state. We pass this function mapStateToProps to the connect function below
// and then connect calls our mapStateToProps function with the redux state as the argument. This allows us to access the redux
// state by passing it into the props of this component at creation time.
const mapStateToProps = (state) => ({
  auth: state.auth,
});

//We'll create mapStateToProps above in a second. We also want to bring in our logout action which we do in the second argument to connect:
//export default Navbar; Navbar in () at the end of this next line is just returning this component as usual.
export default connect(mapStateToProps, { logout })(Navbar);
