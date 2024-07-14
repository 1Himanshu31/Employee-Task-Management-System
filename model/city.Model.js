const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/Itechnosol");

const citySchema = new mongoose.Schema({
    cityName: 
    {
        type: String
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
}, 
{ timestamps: true });
const city = mongoose.model('city', citySchema);
module.exports = city;
