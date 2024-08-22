const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.route('/:id').get(authController.generateDirectLineToken);

module.exports = router;