'use strict';

const mongoose = require('mongoose');

const historySchema = mongoose.Schema({
    plant_id: String, 
    waterDate: {
        type: Date
    }
});

const History = mongoose.model('History', historySchema);

module.exports = History;