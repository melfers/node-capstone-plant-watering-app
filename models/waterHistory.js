'use strict';

const mongoose = require('mongoose');

const waterHistory = mongoose.Schema({
    plant_id: String, 
    waterDate: {
        type: Date
    }
});

const History = mongoose.model('History', waterHistory);

module.exports = Plant;