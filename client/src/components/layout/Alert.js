import React from 'react';
import PropTypes from 'prop-types';
//Anytime you want to interact a component with redux whether you're calling an action or getting the state, you want to use connect:
import { connect } from 'react-redux';

//destructing alerts instead of doing props.alerts
const Alert = ({ alerts }) =>
  //We don't want to return anything if alerts redux state is null or empty
  alerts !== null &&
  alerts.length > 0 &&
  //map is essentially a forEach loop that goes through everything in alerts and returns something, which in this case, we are going to return JSX
  alerts.map((alert) => (
    //Whenever you loop through an array like this and output JSX, it's a list, so you need to add a unique key for each entry.
    //className evaluates to 'alert alert-danger'
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

//Basically this method gets automatically called with the redux state being passed in here as an argument. Capital S STATE. The entire redux state. And the reducers are apparently considered objects on the state. So the Alert reducer is State.alert.
//We actually want to get the alert state (the redux state we see in redux devTools for alert) into this component. We are mapping the redux state to this component's props (just 'alerts' here, not props.alerts) so that we have access to it. What "it" is in this case, is an array of alert objects:
const mapStateToProps = (state) => ({
  //it's actually state dot whatever reducer we want from the Root Reducer (aka index.js in reducer folder)
  alerts: state.alert,
});

//connect method (which connects this component to Redux) takes in two things:
//First is the redux state you want to map into the props of this component (or any function you want to be called with the redux state as an argument, apparently) The second is an object with any action you want to use, which allows you to do props dot that action.
export default connect(mapStateToProps)(Alert);
