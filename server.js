const User = require('./models/users');
const Plant = require('./models/plants');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const bcrypt = require('bcryptjs');

app.use(express.static('public'));
app.use(express.json());

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');


// ---------- Run/Close Server --------------------
let server;

//starts server and returns a Promise.
function runServer(databaseUrl, port = PORT) {

    return new Promise((resolve, reject) => {
      mongoose.connect(databaseUrl, err => {
        if (err) {
          return reject(err);
        }
        server = app.listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      });
    });
  }

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  }

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

//----------User Endpoints----------

//POST

//User Login
app.post('/users/login', (req, res) => {
  console.log(req.body.username, req.body.password);
  User 
    .findOne({
      username: req.body.username
    }, function(err, items) {
      if (err) {
        return res.status(500).json({
          message: 'Internal server error'
        });
      }
      if (!items) {
        //bad username
        return res.status(401).json({
          message: "Username not found"
        });
      } else {
        items.validatePassword(req.body.password, function(err, isValid) {
          if (err) {
            console.log('Sorry, we couldn\'t validate your email or password.')
          }
          if (!isValid) {
            return res.status(401).json({
              message: 'Not found'
            });
          } else {
            console.log('Login successful!');
            return res.json(items);
          }
        });
      };
    });
});

//Create new user
app.post('/users/signup', (req, res) => {
  let firstName = req.body.firstName;
  let username = req.body.username;
  let password = req.body.password;

  username = username.trim();
  password = password.trim();

  //Create encryption key
  bcrypt.genSalt(10, (err, salt) => {
      if (err) {
          return res.status(500).json({
              message: 'Encryption key creation failed'
          });
      }
      //encrypt password using key 
      bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
              return res.status(500).json({
                  message: 'Password encryption failed'
              });
          }

          User.create({
              firstName,
              username,
              password: hash
          }, (err, item) => {
              if (err) {
                  return res.status(500).json({
                      message: 'Create new user failed'
                  });
              }
              if (item) {
                  return res.status(200).json(item);
              }
          });
      });
  });

});

//Create new plant
app.post('/users/plants/create', (req, res) => {
  let username = req.body.username;
  let plantType = req.body.plantType;
  let nickname = req.body.nickname;
  let waterNumber = req.body.waterNumber;
  let waterFrequency = req.body.waterFrequency;
  let waterHistory = req.body.waterHistory;
  let notes = req.body.notes;

  nickname = nickname.trim();
  console.log(
    req.body.username,
    req.body.plantType, 
    req.body.nickname, 
    req.body.waterNumber, 
    req.body.waterFrequency, 
    req.body.waterHistory,
    req.body.notes
    );

  Plant
    .create({
      username,
      plantType,
      nickname,
      waterNumber,
      waterFrequency,
      waterHistory,
      notes
    }, (err, item) => {
      if(err) {
        return res.status(500).json({
          message: 'Internal server error'
        });
      }
      if (item) {
        console.log(`Added a ${plantType} named ${nickname} to ${username}'s account`);
        return res.json(item);
      }
    });
});

//Show all plants for a user
app.get('/all-plants/:username', (req, res) => {
  console.log(req.params.username);
  Plant
    .find({username: req.params.username})
    .then(plants => {
        console.log(plants);
        let plantOutput = [];
        plants.map(plant => {
          plantOutput.push(plant);
        });
        res.json(plantOutput);
      })
    .catch(err => {
      console.err(err);
      res.status(500).json({ error: 'Something went wrong'});
    });
});


module.exports = { app, runServer, closeServer };
