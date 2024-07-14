const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/Itechnosol");

const departmentSchema = new mongoose.Schema({
    departmentName: 
    {
        type: String 
    },
    description: String,
}, 
{ timestamps: true });

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;