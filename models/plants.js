'use strict';

const mongoose = require('mongoose');

const plantSchema = mongoose.Schema({
    username: String,
    plantType: String,
    nickname: String,
    waterNumber: Number,
    waterFrequency: String,
    waterHistory: [Date],
    notes: String
});

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;