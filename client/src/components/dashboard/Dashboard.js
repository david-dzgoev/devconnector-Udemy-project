//This component is where we're going to fetch all of our data using an action and then bring it in from redux state, and then we'll pass it down to other child components, for instances the experience and education components.
//As soon as the dashboard component loads, we need to pull in the current user's profile. To do that we need profile in our state, which means we need profile reducer and actions file and we need to get that part of the application flowing.
import React from 'react';
import PropTypes from 'prop-types';

const Dashboard = (props) => {
  return <div>Dashboard</div>;
};

Dashboard.propTypes = {};

export default Dashboard;
