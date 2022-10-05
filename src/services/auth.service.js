const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const userService = require('./user.service');
const ApiError = require('../utils/api-error');
const logger = require('../logger');
const { msgConsts } = require('../utils');

const loginUserWithEmailAndPassword = async (email, password) => {
  try {
    const user = await userService.getUserByEmail(email.toLowerCase());
    const isValidPassword = await bcrypt.compare(password, user?.password);
    if (!user || !isValidPassword) {
      throw new ApiError(httpStatus.UNAUTHORIZED, msgConsts.INCORRECT_EMAIL_OR_PASSWORD);
    }
    return user;
  } catch (error) {
    logger.error('ERROR => At loginUserWithEmailAndPassword ', error);
    throw error;
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
};
