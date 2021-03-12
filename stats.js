const mongoose = require('mongoose');
const { Schema } = mongoose;
const serverSchema = new Schema({name: String, players: {type: Number, default: 0}})

const statsSchema = new Schema({
    // EU1: {type: Number, required: true, default: 0},
    // EU2: {type: Number, required: true, default: 0},
    servers: {type: [serverSchema], default: undefined, required: true},
    date: { type: Date, default: Date.now }
});

module.exports = {
    EU: mongoose.model('EU', statsSchema), 
    RU: mongoose.model('RU', statsSchema), 
    NA: mongoose.model('NA', statsSchema),
    ASIA: mongoose.model('ASIA', statsSchema),
    DAY: mongoose.model('DAY', statsSchema)
}