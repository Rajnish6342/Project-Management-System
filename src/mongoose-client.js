const mongoose = require('mongoose');
const { mongodbUrl } = require('./config/config');
const logger = require('./logger');
const { logConsts, msgConsts } = require('./utils');

const dbConnect = () => {
  mongoose.connect(
    mongodbUrl,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    err => {
      if (err) {
        logger.error(`${logConsts.LOG_ERROR} At DbConnect ${err}`);
        throw err;
      }
      logger.info(msgConsts.DB_CONNECTED);
    },
  );
};

module.exports = dbConnect;
