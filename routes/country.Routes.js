const express = require('express');
const router = express.Router();
const countryController = require('../controllers/country.Controllers');

router.post('/create', countryController.createCountry);
router.get('/getCountry', countryController.getCountry);

module.exports = router;