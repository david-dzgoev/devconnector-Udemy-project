//This component is where we're going to fetch all of our data using an action and then bring it in from redux state, and then we'll pass it down to other child components, for instances the experience and education components.
//As soon as the dashboard component loads, we need to pull in the current user's profile. To do that we need profile in our state, which means we need profile reducer and actions file and we need to get that part of the application flowing.
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';

//We want to call getCurrentProfile as soon as this component loads. Use useEffect hooks to do something on component load, and pass in empty brackets to do it only one time.
const Dashboard = ({ getCurrentProfile, auth, profile }) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);
  return <div>Dashboard</div>;
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
