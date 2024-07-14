const express = require('express');
const router = express.Router();
const stateController = require('../controllers/state.Controllers');

router.post('/create', stateController.createState);
router.get('/getState', stateController.getState);

module.exports = router;