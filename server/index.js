var express = require('express');
var bodyParser = require('body-parser');
var pg = require('../psql-database');
var services = require('../services');
var home = require('./routers/admin');
var admin = require('./routers/admin');
var doc = require('./routers/document');
var video = require('./routers/video');
var twilio = require('../services/twilio');
var home = require('./routers/home');
var stripeCharge = require('../services/stripe');

var ensureAuthorized = services.ensureAuth;
var createToken = services.createToken;

var app = express();

app.use('/admin', admin);
app.use('/doc', doc);
app.use('/video', video);
app.use('/home', home);
app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

// Shows how secured paths works and get executed when the user enters the website the first time
app.get('/checkOnClientLoad', ensureAuthorized, (req, res) => {
  pg.selectUserById(req.decoded.id, (error, data) => {
    if (error) {
      res.json({userid: req.decoded.id});
    } else {
      let user = {
        userRole: data.attributes.role,
        firstName: data.attributes.first_name
      };
      res.json(user);
    }
  });
});

// Insert demo-user
// pg.insertUser({
//   email: '123abc@example.com',
//   password: '123',
//   firstName: 'John',
//   lastName: 'Doe',
//   phone: '18001234567',
//   role: 'teacher'
// }, (error, data) => {
//   if (error) {
//     console.error('Error inserting fake user.', error);
//   } else {
//     console.log('Inserted fake user ok.', data);
//   }
// });



app.post('/login', (req, res) => {
  let retrievedUser;
  pg.selectUser({email: req.body.username}, (error, data) => {
    if (error) {
      res.sendStatus(500);
      res.send(JSON.stringify(data));
    } else {
      services.checkHashPassword(req.body.password, data.attributes.password)
      .then((match) => {
        if (match) {
          var payload = {id: data.attributes.id};
          let token = createToken(payload)
            res.json({
              isLoggedIn: true,
              jwtToken: token,
              userRole: data.attributes.role,
              firstName: data.attributes.first_name,
            });
        } else {
          res.json({isLoggedIn: false});
        }
      })
      .catch((err) => {
        if (err) console.log('password issue:', err);
      });
    }
  });
});

app.post('/message', (req, res) => {
  var phoneNumber = req.body.phoneNumber;
  var message = req.body.message;

  twilio.sendMessage(phoneNumber, message);
  res.send('Message sent!');
});

app.post('/donate', (req, res) => {
  let options = {
    amount: req.body.amount,
    currency: 'usd',
    source: req.body.token.id
  };
  console.log('options: ', options);
  stripeCharge(options, (err, result) => {
    if (err) {
      console.log('err: ', err);
      res.send(err);
    } else {
      console.log('result: ', result);
      res.send(result);
    }
  });
});

app.get('/*', (req, res) => {
  res.redirect('/');
  //res.sendFile(__dirname + '/../../dist/index.html');
});

app.listen(process.env.PORT || 5000, function() {
  console.log('Listening on enviornment port or 5000!');
});
