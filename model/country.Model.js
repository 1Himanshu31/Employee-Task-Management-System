const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/Itechnosol");

const countrySchema = new mongoose.Schema({
    countryName: 
    {
        type: String
    },
}, 
{ timestamps: true });

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;