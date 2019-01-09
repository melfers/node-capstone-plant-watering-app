const User = require('./models/users');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();

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
  User 
    .findOne({
      email: req.body.email
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


module.exports = { app, runServer, closeServer };
