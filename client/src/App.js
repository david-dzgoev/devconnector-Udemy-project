import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
//Redux stuff:
//Provider comes from React. Redux is separate than React but the Provider combines them together by wrapping entire app with Provider.
import { Provider } from 'react-redux';
import store from './store';
//Bring in the action
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  //Since we're using a function component here, we need to use useEffect hook instead of componentDidMount to do things whenever the component is loaded.
  //useEffect takes in a function.
  useEffect(() => {
    //Take the store directly because we have access to it and call dispatch which is a method on the store.
    store.dispatch(loadUser());
    //Normally when the state updates, useEffect will keep running and loop forever unless we add an empty set of brackets as a second argument:
    //Adding the empty brackets as an argument here tells React that this Effect does not depend on any values from props or state so React only runs and cleans this up one time. This essentially turns this into componentDidMount.
  }, []);

  return (
    //Need to wrap every thing in provider tag with passed in store so that all components in the app can access the store's contents
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
