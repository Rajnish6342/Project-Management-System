/* eslint-disable consistent-return */
const httpStatus = require('http-status');
const ApiError = require('../utils/api-error');
const { verifyToken } = require('../services/token.service');
const { getUserById } = require('../services/user.service');
const catchAsync = require('../utils/catch-async');

const auth = () => catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  const tokenInstance = await verifyToken(authorization);
  const user = await getUserById(tokenInstance.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  req.user = user;
  next();
});

module.exports = auth;
