const httpStatus = require('http-status');
const catchAsync = require('../utils/catch-async');
const { userService } = require('../services');
const { msgConsts } = require('../utils');
const { generateJsonResponse } = require('../utils/response');

const listUsers = catchAsync(async (req, res) => {
  const users = await userService.listUsers();
  const response = generateJsonResponse(users,
    httpStatus.OK, msgConsts.USER_FETCHED_SUCCESSFULLY);

  return res.send(response);
});

module.exports = {
  listUsers,
};
