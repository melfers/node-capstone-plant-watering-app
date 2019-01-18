const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const User = require('../models/users');
const Plant = require('../models/plants');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

//Create user to seed db and test create user
function generateUser() {
    return {
      firstName: faker.name.firstName(),
      username: faker.random.word(),
      password: faker.internet.password()
    }
}

function seedUserData() {
  console.info('Seeding user data');
  const seedData = [];

  for (let i=1; i<10; i++) {
    seedData.push(generateUser());
  }
  console.log(seedData);
  return User.insertMany(seedData);
}

//Create and seed individual plants to test plant endpoints
const username = faker.random.word();

function generateFrequencyVal() {
  const vals = ['days', 'weeks', 'months'];
  return vals[Math.floor(Math.random() * vals.length)];
}

function generateIndividualPlant() {
  let waterNumber = faker.random.number({
    'min': 1,
    'max': 10
  });

  return {
    username: username,
    plantType: faker.random.word(),
    nickname: faker.name.firstName(),
    waterNumber: waterNumber,
    waterFrequency: generateFrequencyVal(),
    notes: faker.lorem.sentence()
  }
}

function seedIndividualPlantData() {
  console.info('Seeding individual plant data');
  const seedData = [];

  for(let i=1; i<=10; i++) {
    seedData.push(generateIndividualPlant());
  }
  console.log(seedData);
  return Plant.insertMany(seedData);
}

// Tear down Database after each test
function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

//-------------------- Test User Endpoints --------------------

//
describe('Static', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  it('should return a static html file', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
});

describe('Create new user', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL)
    .then(console.log('Running server'))
    .catch(err => console.log(err));
  });

  beforeEach(function() {
    return seedUserData();
  });

  //Test create new user
  it('should create a new user', function() {
    const newUser = generateUser();
    return chai.request(app)
      .post('/users/signup')
      .send(newUser)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
      });
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });
});



//-------------------- Test Plant Endpoints --------------------

describe('Plant API Resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL)
    .then(console.log('Running server'))
    .catch(err => console.log(err));
  });

  beforeEach(function() {
    return seedIndividualPlantData();
  });

  //Test create new plant
  it('should create a new plant', function() {
    const newPlant = generateIndividualPlant();
    return chai.request(app)
      .post('/users/plants/create')
      .send(newPlant)
      .then(function(res) {
        expect(res).to.be.json;
      });
  });

  //Test show all plants for a user
  it('should show all plants for a specific user', function() {
    return chai.request(app)
      .get('/all-plants/' + username)
      .then(function(res) {
        expect(res).to.be.json;
        expect(res).to.be.a('object');
      });
  });

  //Test update individual plant
  it('should update edited information for a plant', function() {
    const oldPlant = generateIndividualPlant();
    const newPlant = generateIndividualPlant();

    return Plant
      .findOne()
      .then(function(plant) {
        oldPlant._id = plant._id;

        return chai.request(app)
          .put(`/save-edit-individual-plant/${oldPlant.username}/${oldPlant._id}`)
          .send(newPlant);
      })
      .then(function(res) {
        expect(res).to.be.json;
        expect(res).to.have.status(200)
      })
    });

  //Test delete individual plant
  it('should delete a plant', function() {
    let plant;

    return Plant 
      .findOne()
      .then(function(_plant) {
        plant = _plant;
        return chai.request(app).delete(`/delete-plant/${plant.username}/${plant._id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
        return Plant.findById(plant.id);
      })
      .then(function(_plant) {
        expect(_plant).to.be.null;
      });
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });
});