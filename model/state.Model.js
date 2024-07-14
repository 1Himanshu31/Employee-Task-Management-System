const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/Itechnosol");

const stateSchema = new mongoose.Schema({
    stateName: 
    {
        type: String
    },
    countryName: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
    },
}, 
{ timestamps: true });
const State = mongoose.model('State', stateSchema);

module.exports = State;