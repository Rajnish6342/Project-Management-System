const express = require('express');
const validate = require('../../middlewares/validate');
const { tokenValidations } = require('../../utils/validations');
const tokenController = require('../../controllers/token.controller');

const router = express.Router();

router.post('/generate', validate(tokenValidations.token), tokenController.generateToken);

module.exports = router;
