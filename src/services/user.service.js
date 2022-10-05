const httpStatus = require('http-status');
const models = require('../models');
const ApiError = require('../utils/api-error');
const { msgConsts } = require('../utils');
const logger = require('../logger');

const {
  UserModel,
} = models;

const getUserByEmail = async email => UserModel.findOne({ email });

const createUser = async userBody => {
  try {
    if (await getUserByEmail(userBody.email.toLowerCase())) {
      throw new ApiError(httpStatus.BAD_REQUEST, msgConsts.EMAIL_ALREADY_EXISTS);
    }
    userBody.email = userBody.email.toLowerCase();
    const user = await UserModel.create(userBody);
    return user;
  } catch (error) {
    logger.error('Error At => createUser', error);
    throw error;
  }
};

const getUserById = async id => {
  try {
    const userInstance = await UserModel.findById(id);
    return userInstance;
  } catch (error) {
    logger.error('Error At => getUserById', error);
    throw error;
  }
};

const listUsers = async () => {
  try {
    const userInstance = await UserModel.find({});
    return userInstance;
  } catch (error) {
    logger.error('Error At => listUsers', error);
    throw error;
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  listUsers,
};
