const express = require('express');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.get('/', userController.listUsers);

module.exports = router;
