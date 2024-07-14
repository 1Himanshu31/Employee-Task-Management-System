const employeeService = require('../services/employee.Services');
exports.createEmployee = async function (req, res, next) 
{
    try 
    {
        const employeeData = req.body;
        const createdEmployee = await employeeService.createEmployees(employeeData);
        return res.status(200).json({ status: 200, data: createdEmployee, message: 'Employee created successfully' });
    } 
    catch (error) 
    {
        return res.status(500).json({ status: 500, message: error.message });
    }
};
exports.importEmployees = async function (req, res, next) 
{
    try 
    {
        const employeesData = req.body;
        if (employeesData == null & employeesData == undefined) 
        {
            throw new Error( "Request body cannot be null or undefined.");
        }
        if (!Array.isArray(employeesData)) 
        {
            return res.status(400).json({ status: 400, message: 'Invalid request body. Expected an array.' });
        }
        for (const employees of employeesData) 
            {
            for (const key in employees) 
                {
                if (Array.isArray(employees[key])) 
                    {
                    if (employees[key].some(value => value === null || value === undefined)) 
                    {
                        throw new Error(`${key} cannot have null or undefined values.`);
                    }
                } 
                else 
                {
                    if (employees[key] === null || employees[key] === undefined) 
                    {
                        throw new Error(`${key} cannot be null or undefined.`);
                    }
                }
            }
        }
        const importedEmployees = await employeeService.importEmployees(employeesData);

        return res.status(200).json({ status: 200, data: importedEmployees, message: 'Employees imported successfully' });
    } 
    catch (error) 
    {
        console.error('Error in importEmployees:', error.message);
        return res.status(500).json({ status: 500, message: error.message });
    }
};
exports.getEmployees = async function (req, res, next) 
{
    try 
    {
        const employees = await employeeService.getEmployees(req);
        return res.status(200).json({ status: 200, data: employees, message: 'Employees retrieved successfully' });
    } 
    catch (error) 
    {
        return res.status(500).json({ status: 500, message: error.message });
    }
};
exports.getEmployeesDashboard = async function (req, res, next) 
{
    try 
    {
        const employeesDashboardData = await employeeService.getEmployeesDashboard(req);
        return res.status(200).json({ status: 200, data: employeesDashboardData, message: 'Employees dashboard data retrieved successfully' });
    } 
    catch (error) 
    {
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};
// router.get('/generate-excel', async (req, res) => {
//     try {
//       await generateExcel(); // Call generateExcel when this route is accessed
//       res.status(200).send('Excel file generated successfully');
//     } catch (error) {
//       console.error('Error generating Excel:', error.message);
//       res.status(500).json({ status: 500, message: 'Error generating Excel' });
//     }
//   });
exports.getEmployeeDetail = async function (req, res, next) 
{
    try 
    {
        const employeeId = req.body.employeeId;
        const employee = await employeeService.getEmployeeById(employeeId);
        return res.status(200).json({ status: 200, data: employee, message: 'Employee retrieved successfully' });
    } 
    catch (error) 
    {
        return res.status(500).json({ status: 500, message: error.message });
    }
};
exports.updateEmployeeStatus = async function (req, res, next) 
{
    try 
    {
        const { employeeId, isActive } = req.body;
        const employee = await employeeService.updateEmployeeStatus(employeeId);
        if (!employee) 
        {
            throw new Error('Employee not found');
        }
        const updatedEmployee = await employeeService.updateEmployeeStatus(employeeId, isActive);
        return res.status(200).json({ status: 200, data: updatedEmployee, message: 'Employee status updated successfully' });
    } 
    catch (error) 
    {
        return res.status(500).json({ status: 500, message: error.message });
    }
};
// exports.canDeleteEmployee = async function (req, res, next) {
//     try {
//         const { employeeId } = req.body;
//         const { canDelete, employee } = await employeeService.canDeleteEmployee(employeeId);

//         return res.status(200).json({
//             status: 200,
//             data: { canDelete, employee },
//             message: 'Check for employee deletion eligibility successful'
//         });
//     } catch (error) {
//         return res.status(500).json({ status: 500, message: error.message });
//     }
// };
exports.getEmployeeList = async function (req, res, next) 
{
    try 
    {
        const employeeList = await employeeService.getEmployeeList();
        return res.status(200).json({ status: 200, data: employeeList, message: 'Employee list retrieved successfully' });
    } 
    catch (error) 
    {
        return res.status(500).json({ status: 500, message: error.message });
    }
};
exports.updateEmployee = async function (req, res, next) 
{
    try 
    {
        const { employeeId } = req.body;
        const updatedData = req.body.updatedData; // Include the updated data in the request body

        const updatedEmployee = await employeeService.updateEmployee(employeeId, updatedData);

        return res.status(200).json
        ({
            status: 200,
            data: updatedEmployee,
            message: 'Employee updated successfully'
        });
    } 
    catch (error) 
    {
        return res.status(500).json({ status: 500, message: error.message });
    }
};