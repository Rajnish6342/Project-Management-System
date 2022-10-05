const Joi = require('joi');

const token = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

module.exports = {
  token,
};
