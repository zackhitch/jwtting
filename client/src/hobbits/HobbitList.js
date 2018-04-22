import React, { Fragment } from 'react';
import axios from 'axios';

class HobbitList extends React.Component {
  state = {
    hobbits: [],
  };

  render() {
    return (
      <Fragment>
        <h2>Hobbit List</h2>
        <ul>
          {this.state.hobbits.map(hobbit => {
            return <li key={hobbit._id}>{hobbit.username}</li>;
          })}
        </ul>
      </Fragment>
    );
  }

  componentDidMount() {
    const token = localStorage.getItem('authtoken');

    const requestOptions = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get('http://localhost:5000/api/hobbits', requestOptions)
      .then(({ data }) => {
        this.setState({ hobbits: data });
      })
      .catch(err => {
        console.log('ERROR: ', err);
      });
  }
}

export default HobbitList;
