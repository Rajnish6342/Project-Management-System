const Joi = require('joi');
const { typeConsts: { projectTypes, projectUserRoles, sortBy } } = require('../index');

Joi.objectId = require('joi-objectid')(Joi);

const createProject = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    type: Joi.string()
      .valid(projectTypes.PRIVATE, projectTypes.PUBLIC)
      .default(projectTypes.PUBLIC),
  }),
};

const listProjects = {
  query: Joi.object().keys({
    limit: Joi.number().default(10),
    offset: Joi.number().default(0),
    type: Joi.string()
      .valid(projectTypes.PRIVATE, projectTypes.PUBLIC),
    sortBy: Joi.string()
      .valid(sortBy.ASC, sortBy.DESC)
      .default(sortBy.DESC),
  }),
};

const listUserProjects = {
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
};

const updateProject = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
  }),
  params: Joi.object().keys({
    projectId: Joi.objectId().required(),
  }),
};

const deleteProject = {
  params: Joi.object().keys({
    projectId: Joi.objectId().required(),
  }),
};

const shareProject = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    role: Joi.string().valid(projectUserRoles.VIEW, projectUserRoles.EDIT)
      .default(projectUserRoles.VIEW),
  }),
  params: Joi.object().keys({
    projectId: Joi.objectId().required(),
  }),
};

const unshareProject = {
  body: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
  params: Joi.object().keys({
    projectId: Joi.objectId().required(),
  }),
};

module.exports = {
  createProject,
  updateProject,
  shareProject,
  unshareProject,
  listProjects,
  listUserProjects,
  deleteProject,
};
