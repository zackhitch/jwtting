import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';

import logo from './logo.svg';
import './App.css';
import Signin from './auth/Signin';
import HobbitList from './hobbits/HobbitList';

class App extends Component {
  state = {
    user: null,
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {this.state.user && (
            <h1 className="App-title">Welcome {this.state.user.username}!</h1>
          )}
        </header>
        <Route
          to="/signin"
          render={props => <Signin {...props} onSignin={this.signinSuccess} />}
        />

        <Route path="/hobbits" component={HobbitList} />
      </div>
    );
  }

  signinSuccess = data => {
    // console.log(data);

    this.setState({ user: data.user });
    localStorage.setItem('authtoken', data.token);
    console.log(this.state);
  };
}

export default App;
