import React from 'react';
import axios from 'axios';

class Signin extends React.Component {
  state = {
    username: '',
    password: '',
  };

  render() {
    return (
      <form onSubmit={this.submithandler} className="form">
        <div className="form-row">
          <label>Username</label>
          <input
            name="username"
            value={this.state.username}
            onChange={this.inputHandler}
            type="test"
          />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input
            name="password"
            value={this.state.password}
            onChange={this.inputHandler}
            type="password"
          />
        </div>
        <div className="form-row">
          <button>Sign In: </button>
        </div>
      </form>
    );
  }

  inputHandler = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
    console.log(this.state);
  };

  submithandler = event => {
    event.preventDefault();

    axios
      .post('http://localhost:5000/api/login', this.state)
      .then(response => {
        console.log('response: ', response.data);
        this.props.onSignin(response.data);
        this.props.history.push('/hobbits');
      })
      .catch(err => {
        console.log('ERROR You are not authorized: ', err);
      });
  };
}

export default Signin;
