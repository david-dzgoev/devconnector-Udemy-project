import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//This component has to accept a component prop and anything else that is passed into it.
//We need to interact with the auth state in our reducer for this component to work.
//...rest will take anything else that is passed in
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest}
    //This is a render prop: "A component with a render prop takes a function that returns a React element and calls it instead of implementing its own render logic." in other words "A render prop is a function prop that a component uses to know what to render".
    //Not 100% sure what routeProps is here. The "routeProps" here seems to be required react-router specific information that is always passed into Components that are children elements of React Route render methods such as <Route component>.
    render={(routeProps) =>
      !isAuthenticated && !loading ? (
        <Redirect to='/login' />
      ) : (
        //We do component and any props that are passed into that
        <Component {...routeProps} />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

//no actions so just mapStateToProps passed in to connect here
export default connect(mapStateToProps)(PrivateRoute);
