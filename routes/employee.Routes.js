const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.Controllers');

// module.exports = function(app) {

router.post('/create', employeeController.createEmployee);
router.get('/getEmployees', employeeController.getEmployees);
router.get('/getEmployeeDetail', employeeController.getEmployeeDetail);
router.post('/updateStatus', employeeController.updateEmployeeStatus);

// router.post('/canDelete', employeeController.canDeleteEmployee);
router.get('/getEmployeeList', employeeController.getEmployeeList);
router.get('/updateEmployee', employeeController.updateEmployee);
// router.get('/generateExcel', employeeController.updateEmployee);
router.get('/getEmployeesDashboard', employeeController.getEmployeesDashboard);
router.post('/importEmployees', employeeController.importEmployees);

module.exports = router;
