const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/Itechnosol");
const Department = require('./department.Model');
const Country = require('./country.Model');
const State = require('./state.Model');
const City = require('./city.Model');
const Zipcode = require('./zipcode.Model');

const citySchema = new mongoose.Schema({}); 
const CityModel = mongoose.model('City', citySchema);

const employeeSchema = new mongoose.Schema({
    employeeName: {
        type: String
    },
    dob: {
        type: Number
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
    },
    phoneNo: Number,
    email: {
        type: String
    },
    address: String,
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
    },
    zipcode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Zipcode'
    },
    fileName: { // Add fileName field
        type: String // Assuming fileName is a string
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
