/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');
const logger = require('../logger');
const { msgConsts } = require('../utils');

const generateToken = (userId, expires, secret = config.tokenSecretKey) => {
  const payload = {
    sub: { userId },
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

const verifyToken = async token => {
  try {
    [, token] = token.split('Bearer ');
    const payload = jwt.verify(token, config.tokenSecretKey);
    return payload?.sub;
  } catch (error) {
    logger.error('ERROR => At verifyToken ', error);
    throw Error(msgConsts.SOMETHING_WENT_WRONG_LOGIN_AGAIN);
  }
};

const generateAuthTokens = async user => {
  try {
    const accessTokenExpires = moment().add(config.tokenExpiryTime, 'minutes');
    const accessToken = generateToken(user._id, accessTokenExpires);
    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
    };
  } catch (error) {
    logger.error('ERROR => At generateAuthTokens ', error);
    throw error;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  generateAuthTokens,
};
