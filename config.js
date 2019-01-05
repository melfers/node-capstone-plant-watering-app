'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL ||
                      'mongodb://user1:friday13@ds119588.mlab.com:19588/node-capstone-plant-watering-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                      'mongodb://user1:friday13@ds249824.mlab.com:49824/test-node-capstone-plant-watering-app';
exports.PORT = process.env.PORT || 8080;