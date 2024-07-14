const departmentService = require('../services/department.Services');

exports.createDepartment = async function (req, res, next) 
{
    try 
    {
        const departmentData = req.body;
        const createDepartment = await departmentService.createDepartment(departmentData);
        return res.status(200).json({ status: 200, data: createDepartment, message: 'Department created successfully'});
    } 
    catch (error) 
    {
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getDepartments = async function (req, res, next) 
{
    try 
    {
        const department = await departmentService.getDepartment();
        return res.status(200).json({ status: 200, data: department, message: 'Department retrieved successfully' });
    } 
    catch (error) 
    {
        return res.status(500).json({ status: 500, message: error.message });
    }
};