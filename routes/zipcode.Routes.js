const express = require('express');
const router = express.Router();
const zipcodeController = require('../controllers/zipcode.Controllers');

router.post('/create', zipcodeController.createZipcode);
router.get('/getZipcode', zipcodeController.getZipcode);

module.exports = router;