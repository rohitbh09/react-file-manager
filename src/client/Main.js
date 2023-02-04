import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './components/login';
import Home from './components/home';
import { AuthRoute } from './util/route';
class Main extends React.Component {
  render () {
    return (
      <div>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <AuthRoute path="/home" exact component={Home} />
        </Switch>
      </div>
    );
  }
}

export default Main;