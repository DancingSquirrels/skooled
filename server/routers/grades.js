const express = require('express');
const router = express.Router();
const pg = require('../../psql-database');
const bodyParser = require('body-parser');
const services = require('../../services');
const Promise = require('bluebird');

const ensureAuthorized = services.ensureAuth;

router.use(express.static(__dirname + '/../../react-client/dist'));
router.use(bodyParser.json());


router.get('/classes', ensureAuthorized, (req, res) => {
  // Select all classes from db to send back to client for grades.
  pg.selectAllClassesForUser(req.body, (error, data) => {
    if (error) {
      console.error('Error retrieving all classes from db', error);
      res.sendStatus(500);
    } else {
      console.log(data);
      res.send(data);
    }
  });
});

router.get('/studentsPerClass', (req, res) => {
  // Select all classes from db to send back to client for grades.
  pg.selectStudentsPerClass(req.query.id, (error, data) => {
    if (error) {
      console.error('Error retrieving all classes from db', error);
      res.sendStatus(500);
    } else {
      res.send(data);
    }
  });
});

router.get('/homeworkPerClass', (req, res) => {
  // Select all classes from db to send back to client for grades.
  options = {
    class_id:req.query.id
  }
  pg.fetchHomework(options, (error, data) => {
    if (error) {
      console.error('Error retrieving all homework for a class from db', error);
      res.sendStatus(500);
    } else {
      res.send(data);
    }
  });
});

router.post('/insertgrades', (req, res) => {
  pg.insertGradesForClass(req.body, (error, data) => {
    if (error) {
      console.error('Error updating all grades to db', error);
      res.sendStatus(500);
      return;
    } else {
      res.send(data);
    }
  });
});

// STUDENT LOGIN: GRADES

router.get('/student-grades', (req, res) => {
  pg.fetchGrades(req.query.id, (error, data) => {
    if (error) {
      console.error('Error retrieving all homework for a class from db', error);
      res.sendStatus(500);
    } else {
      res.send(data);
    }
  });
});


module.exports = router;
