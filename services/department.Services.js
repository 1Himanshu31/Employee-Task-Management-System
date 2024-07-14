const Department = require('../model/department.Model');

exports.createDepartment = async function (departmentData) 
{
    try 
    {
        const newDepartment = new Department(departmentData);
        const savedDepartment = await newDepartment.save();
        return savedDepartment;
    } 
    catch (error) 
    {
        throw new Error('Error while creating department:' + error.message);
    }
};

exports.getDepartment = async function () 
{
    try 
    {
        const department = await Department.find();
        return department;
    } 
    catch (error) 
    {
        throw new Error('Error while retrieving department: ' + error.message);
    }
};