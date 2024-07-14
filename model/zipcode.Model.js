const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/Itechnosol");
const City = require('./city.Model');
const State = require('./state.Model');
const Country = require('./country.Model');

const zipcodeSchema = new mongoose.Schema({
    zipcode: 
    {
        type: Number
    },
    cityName: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'city',
    },
    stateName: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
    },
    countryName: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
    },
    isActive: 
    {
        type: Boolean,
        default: true
    },
    isDeleted: 
    {
        type: Boolean,
        default: false
    },
}, 
{ timestamps: true });
const zipcode = mongoose.model('Zipcode', zipcodeSchema);
module.exports = zipcode;