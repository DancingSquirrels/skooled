import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import CreateUser from './CreateUser.jsx';
import Nav from './Nav.jsx';
import axios from 'axios';
import DocumentsList from './DocumentsList.jsx';
import CreateDocument from './CreateDocument.jsx';
import Message from './Message.jsx';
import Video from './Video.jsx';
import Logout from './Logout.jsx';
import Home from './Home.jsx';
import ClassList from './ClassList.jsx';
import StudentList from './StudentList.jsx';
import StudentProfile from './StudentProfile.jsx';
import Donate from './Donate.jsx';
import Grades from './Grades.jsx';
import GradesStudent from './GradesStudent.jsx';
import FormBuilder from './FormBuilder.jsx';
import Homework from './forms/Homework.jsx';
import ClassProfile from './ClassProfile.jsx';
import Assignments from './forms/Assignments.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStudent: '',
      currentClass: ''
    }

    this.studentOnClick = this.studentOnClick.bind(this);
    this.classOnClick = this.classOnClick.bind(this);
  }

  studentOnClick(student) {
    this.setState({
        currentStudent: student
      }, () => {
        this.props.history.push('/studentProfile')
      })
  }

  classOnClick(classData) {
    this.setState({
      currentClass: classData
    }, () => {
      this.props.history.push('/classProfile')
    })
  }

  render () {
    if (!this.props.isLoggedIn) {
      return (<Redirect to="/login"/>);
    } else {
      return (
        <div>
          <Nav userType={this.props.userType}/>
          <div className="main container-fluid col-md-12">
            <Route name="home" exact path="/" component={() => (<Home userType={this.props.userType} firstName={this.props.firstName} myStudents={this.props.myStudents} studentOnClick={this.studentOnClick}/> )} />
            <Route name="nav" path="/nav" component={Nav} />
            <Route name="admin" path="/admin" component={() => (<CreateUser /> )} />
            <Route name="documents" path="/documents" component={() => (<DocumentsList userType={this.props.userType} /> )} />
            <Route name="createDocument" path="/createDocument" component={() => (<CreateDocument userType={this.props.userType} reRender={this.reRender}/>)} />
            <Route name="video" path="/video" component={() => (<Video /> )} />
            <Route name="grades" path="/grades" component={() => (<Grades /> )} />
            <Route name="studentgrades" path="/studentgrades" component={() => (<GradesStudent userType={this.props.userType} firstName={this.props.firstName} /> )} />
            <Route name="classList" path="/classList" component={() => (<ClassList classOnClick={this.classOnClick}/> )} />
            <Route name="studentList" path="/studentList" component={() => (<StudentList studentOnClick={this.studentOnClick} /> )} />
            <Route name="studentProfile" path="/studentProfile" component={() => (<StudentProfile currentStudent={this.state.currentStudent} /> )} />
            <Route name="message" path="/message" component={Message} />
            <Route name="formBuilder" path="/formBuilder" component={(props) => (<FormBuilder {...props}/> )} />
            <Route name="homework" path="/homework" component={(props) => (<Homework {...props}/>)} />
            <Route name="classProfile" path="/classProfile" component={() => (<ClassProfile currentClass={this.state.currentClass} />)} />
            <Route name="assignments" path="/assignments" component={() => (<Assignments />)} />
            <Route name="logout" path="/logout" component={() => (<Logout revokeCredentials={this.props.revokeCredentials}/> )} />
            <Route name="donate" path="/donate" component={Donate} />
        </div>
        </div>
      );
    }
  }
}

export default App;
