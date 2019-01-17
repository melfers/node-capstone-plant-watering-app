'use strict';

const mongoose = require('mongoose');

const plantSchema = mongoose.Schema({
    username: String,
    icon: String,
    plantType: String,
    nickname: String,
    waterNumber: Number,
    waterFrequency: String,
    waterHistory: {
        type: Date
    },
    notes: String
});

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;
