const User = require('./models/users');
const Plant = require('./models/plants');
const History = require('./models/history');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const bcrypt = require('bcryptjs');
const moment = require('moment');

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

//Verify no plant exists with input nickname
app.get('/verifyNickname/:username/:inputNickname', (req, res) => {
  console.log(req.params.inputNickname);
  Plant
    .find({
      username: req.params.username,
      nickname: req.params.inputNickname
    })
    .then(result => {
        console.log(result.length);
        res.json({result});
      })
    .catch(err => {
      console.err(err);
      res.status(500).json({ error: 'Something went wrong'});
    });
})

//Create new plant
app.post('/users/plants/create', (req, res) => {
  let username = req.body.username;
  let icon = req.body.icon;
  let plantType = req.body.plantType;
  let nickname = req.body.nickname;
  let waterNumber = req.body.waterNumber;
  let waterFrequency = req.body.waterFrequency;
  let waterHistory = req.body.waterHistory;
  let notes = req.body.notes;

  nickname = nickname.trim();
  console.log(
    req.body.username,
    req.body.icon,
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
      icon,
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

//Create new water history
app.post('/users/plants/history', (req, res) => {
  let plant_id = req.body.plant_id;
  let waterDate = req.body.waterDate;

  console.log(
    req.body.plant_id,
    req.body.waterDate
    );

  History
    .create({
      plant_id,
      waterDate
    }, (err, item) => {
      if(err) {
        return res.status(500).json({
          message: 'Internal server error'
        });
      }
      if (item) {
        return res.json(item);
      }
    });
});

//Get water history for individual plant
app.get('/waterHistory/:plant_id', (req, res) => {
  console.log(req.params.plant_id);
  History
    .find({plant_id: req.params.plant_id})
    .sort({waterDate: -1})
    .then(history => {
        console.log(history);
        res.json(history);
      })
    .catch(err => {
      console.err(err);
      res.status(500).json({ error: 'Something went wrong'});
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

//View individual plant info
app.get('/individual-plant/:username/:selectedPlant', (req, res) => {
  console.log(req.params.selectedPlant);
  Plant
    .findOne({
      username: req.params.username,
      _id: req.params.selectedPlant
    })
    .then(plant => {
      console.log(plant);
      res.json(plant);
    })
    .catch(err => {
      console.err(err);
      res.status(500).json({ error: 'Something went wrong'});
    });
});

//Add new water date for individual plant
app.put('/add-water-date/:username/:selectedPlant', (req, res) => {
  console.log(req.params.selectedPlant, req.body.newWaterDate);
  const formattedWaterDate = (moment(req.body.newWaterDate).format('MM/DD/YYYY'));

  Plant
    .update({
      username: req.params.username,
      _id: req.params.selectedPlant
    }, { $set: {
      waterHistory: formattedWaterDate
    }
  })
    .then(updatedPlant => {
      res.status(200).json({
        username: updatedPlant.username,
        plantType: updatedPlant.plantType,
        nickname: updatedPlant.nickname, 
        waterNumber: updatedPlant.waterNumber,
        waterFrequency: updatedPlant.waterFrequency,
        waterHistory: updatedPlant.waterHistory,
        notes: updatedPlant.notes
      });
    })
    .catch(err => res.status(500).json({ message: err}));
  });

//Delete an individual plant
app.delete('/delete-plant/:username/:selectedPlant', (req, res) => {
  console.log(req.params.selectedPlant);

  Plant
    .findOneAndDelete({
      username: req.params.username,
      _id: req.params.selectedPlant
    })
    .then(() => {
      console.log(`${req.params.selectedPlant} was deleted`);
      res.status(204).json({ message: `${req.params.selectedPlant} was deleted`});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        message: 'Internal server error deleting entry'
      })
    });
});

//Populate edit individual plant
app.get('/edit-individual-plant/:username/:selectedPlant', (req, res) => {
  console.log(req.params.selectedPlant);
  Plant
    .findOne({
      username: req.params.username,
      _id: req.params.selectedPlant
    })
    .then(plant => {
      console.log(plant);
      res.json(plant);
    })
    .catch(err => {
      console.err(err);
      res.status(500).json({ error: 'Something went wrong'});
    });
})

//Save edits to individual plant
app.put('/save-edit-individual-plant/:username/:selectedPlant', (req, res) => {
  console.log(req.params.username, req.params.selectedPlant);
  Plant
    .update({
      username: req.params.username,
      _id: req.params.selectedPlant
    }, { $set: { 
        icon: req.body.editedIcon,
        plantType: req.body.editedPlantType,
        nickname: req.body.editedNickname,
        waterNumber: req.body.editedWaterNumber,
        waterFrequency: req.body.editedWaterFrequency,
        notes: req.body.editedNotes
      }
    })
    .then(updatedPlant => {
      res.status(200).json({
        username: updatedPlant.username,
        icon: updatedPlant.icon,
        plantType: updatedPlant.plantType,
        nickname: updatedPlant.nickname, 
        waterNumber: updatedPlant.waterNumber,
        waterFrequency: updatedPlant.waterFrequency,
        notes: updatedPlant.notes
      });
    })
    .catch(err => res.status(500).json({ message: err}));
})

//Check signup info to ensure unique username
app.get('/users/verifySignup/:username', (req, res) => {
  console.log(req.params.username);
  User
    .find({
      username: req.params.username
    })
    .then(result => {
        console.log(result.length);
        res.json({result});
      })
    .catch(err => {
      console.err(err);
      res.status(500).json({ error: 'Something went wrong'});
    });
})

module.exports = { app, runServer, closeServer };
