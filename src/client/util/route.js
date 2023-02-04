import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';

const Auth = ({ component: Component, path, isLogin, exact }) => (
  <Route path={path} exact={exact} render={(props) => {
    return isLogin ? (
      <Component {...props} />
    ) : (
      <Redirect to="/login" />
    );
  }} />
);

const mapStateToProps = state => {
  // return { loggedIn: Boolean(state.session.id) };
  return { isLogin: Boolean(state.users.isLogin) };
};

export const AuthRoute = withRouter(connect(mapStateToProps)(Auth));
