/* eslint-disable no-process-exit */
const connectDB = require('../mongoose-client');
const models = require('../models');
const logger = require('../logger');
const usersData = require('./data/user.json');
const projectsData = require('./data/project.json');

const seedData = async () => {
  try {
    connectDB();
    const {
      UserModel,
      ProjectMemberModel,
      ProjectModel,
    } = models;
    await Promise.all([
      ProjectMemberModel.deleteMany({}),
      ProjectModel.deleteMany({}),
      UserModel.deleteMany({}),
    ]);
    await Promise.all([
      UserModel.insertMany(usersData),
      ProjectModel.insertMany(projectsData),
    ]);
    logger.info('DUMMY DATA ADDED SUCCESSFULLY');
    return true;
  } catch (error) {
    logger.error('ERROR AT SEEDING DATA', error);
    throw error;
  }
};
(function () {
  seedData().then(() => process.exit(1)).catch(() => process.exit(1));
}());
