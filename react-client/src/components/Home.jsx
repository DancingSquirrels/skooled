import React from 'react';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    if (this.props.userType === 'teacher') {
      return (
      	<div>
          <div className="rowOne" >
            <h3>Students and Classes</h3>
            <Link to="studentList">My Students</Link>
            <Link to="classList">My Classes</Link>
          </div>
          <div className="rowTwo">
            <h3>Admin</h3>
            <Link to="documents">Permission Slips</Link>
            <Link to="video">Video</Link>
            <Link to="admin">Create Users</Link>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div className="rowOne" >
            <h3>Students</h3>
          </div>
          <div className="rowTwo">
            <h3>Activities</h3>
            <Link to="documents">Permission Slips</Link>
            <Link to="video">Video</Link>
          </div>
        </div>
      )
    }
  }
}

export default Home;