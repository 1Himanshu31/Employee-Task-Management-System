const express = require('express');
const router = express.Router();
const cityController = require('../controllers/city.Controllers');

router.post('/create', cityController.createCity);
router.get('/getCity', cityController.getCity);

module.exports = router;