var express = require('express');
var router = express.Router();
var pg = require('../../psql-database');
var bodyParser = require('body-parser');
var services = require('../../services');

var ensureAuthorized = services.ensureAuth;

router.use(express.static(__dirname + '/../../react-client/dist'));
router.use(bodyParser.json());


router.get('/students', ensureAuthorized, (req, res) => {
  // Select all students from db to send back to client for ParentAdmin form.
  pg.selectAllStudents(req.body, (error, data) => {
    if (error) {
      console.error('Error retrieving all students from db', error);
      res.sendStatus(500);
    } else {
      console.log('Retrieved all students from db', data);
      res.send(data);
    }
  });
});


router.post('/teacher', ensureAuthorized, (req, res) => {
  console.log('req.body', req.body);

  // Create welcome email with new password
  services.sendEmail({
    from: 'no-reply@skooled.com',
    to: req.body.email,
    subject: 'Welcome ' + req.body.firstName + ' to your Skooled account!',
    html: 'Please use \'' + req.body.password + '\' as your password.',
  });

  pg.insertUser(req.body, (error, data) => {
    if (error) {
      console.log('Error inserting new teacher info to db.', error);
      res.sendStatus(500);
    } else {
      console.log('Inserted new teacher info to db.', data);
      res.sendStatus(200);
    }
  });
});


router.post('/parent', ensureAuthorized, (req, res) => {
  console.log('req.body inside POST /admin/parent', req.body);

  // Create welcome email with new password
  services.sendEmail({
    from: 'no-reply@skooled.com',
    to: req.body.email,
    subject: 'Welcome ' + req.body.firstName + ' to your Skooled account!',
    html: 'Please use \'' + req.body.password + '\' as your password.',
  });

  pg.insertUser(req.body, (error, data) => {
    if (error) {
      console.error('Error inserting new parent info to db.', error);
      res.sendStatus(500);
    } else {
      // Create the relationship in the join table for 'parent' and Student
      pg.insertUserStudent(data.toJSON().id, req.body.studentId);

      console.log('Inserted new parent info to db.', data);
      res.sendStatus(200);
    }
  });
});


router.post('/student', ensureAuthorized, (req, res) => {
  console.log('req.body inside POST /admin/student', req.body);
  pg.insertStudent(req.body, (error, data) => {
    if (error) {
      console.error('Error inserting new student info to db.', error);
      res.sendStatus(500);
    } else {
      // Create the relationship in the join table for 'teacher' and Student
      pg.insertUserStudent(req.decoded.id, data.toJSON().id);
      console.log('Inserted new student info to db.', data);
      res.sendStatus(200);
    }
  });
});

module.exports = router;