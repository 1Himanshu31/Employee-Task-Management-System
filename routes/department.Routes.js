const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.Controllers');

router.post('/create', departmentController.createDepartment);
router.get('/getDepartment', departmentController.getDepartments);

module.exports = router;