const httpStatus = require('http-status');
const catchAsync = require('../utils/catch-async');
const { userService, tokenService } = require('../services');
const { generateJsonResponse, createErrorResponse } = require('../utils/response');
const { msgConsts } = require('../utils');

const generateToken = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await userService.getUserByEmail(email);

  if (!user) return createErrorResponse({ message: msgConsts.USER_NOT_FOUND }, res);

  const token = await tokenService.generateAuthTokens(user);
  const response = generateJsonResponse({ user, token },
    httpStatus.OK, msgConsts.LOGIN_SUCCESSFUL);

  return res.send(response);
});

module.exports = {
  generateToken,
};
